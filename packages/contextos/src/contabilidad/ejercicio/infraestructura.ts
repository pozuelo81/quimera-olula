import { RestAPI } from "@olula/lib/api/rest_api.ts";
import ApiUrls from "#/contabilidad/comun/urls.ts";
import {
    Ejercicio,
    EstadoEjercicio,
    GenerarPgc,
    GetEjercicio,
    GetEjercicios,
    NuevoEjercicio,
    OpcionesCierre,
    ResultadoCierre,
} from "./diseño.ts";
import { seriesDesdeTexto } from "./dominio.ts";

const urls = new ApiUrls();
const baseUrl = urls.EJERCICIO;

export interface EjercicioApi {
    id: string;
    nombre: string;
    empresa_id: number | null;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    digitos_subcuenta: number;
    plan_contable: string | null;
    tiene_pgc: boolean;
    asiento_apertura_id: number | null;
    asiento_pyg_id: number | null;
    asiento_cierre_id: number | null;
}

const fechaDesdeApi = (fecha: string): Date => new Date(`${fecha}T12:00:00`);
const dos = (n: number): string => String(n).padStart(2, "0");

export const fechaAApi = (fecha: Date): string =>
    `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;

export const ejercicioDesdeApi = (api: EjercicioApi): Ejercicio => ({
    id: api.id,
    nombre: api.nombre ?? "",
    empresaId: api.empresa_id,
    fechaInicio: fechaDesdeApi(api.fecha_inicio),
    fechaFin: fechaDesdeApi(api.fecha_fin),
    estado: (api.estado === "CERRADO" ? "CERRADO" : "ABIERTO") as EstadoEjercicio,
    digitosSubcuenta: api.digitos_subcuenta,
    planContable: api.plan_contable ?? "",
    tienePgc: api.tiene_pgc,
    asientoAperturaId: api.asiento_apertura_id,
    asientoPygId: api.asiento_pyg_id,
    asientoCierreId: api.asiento_cierre_id,
});

export const getEjercicios: GetEjercicios = async (criteria) =>
    RestAPI.getQuery<Ejercicio, EjercicioApi>(baseUrl, criteria, ejercicioDesdeApi);

export const getEjercicio: GetEjercicio = async (id) =>
    RestAPI.getItem<Ejercicio, EjercicioApi>(`${baseUrl}/${id}`, ejercicioDesdeApi);

/** El ejercicio que empieza justo después (donde el cierre deja la apertura),
 * con el mismo criterio que el servidor: el primero con fecha de inicio
 * posterior. */
export const getEjercicioSiguiente = async (ejercicio: Ejercicio): Promise<Ejercicio | null> => {
    const { datos } = await getEjercicios({
        filtro: [["fecha_inicio", ">", fechaAApi(ejercicio.fechaInicio)]],
        orden: ["fecha_inicio", "ASC"],
        paginacion: { limite: 1, pagina: 1 },
    });
    return datos[0] ?? null;
};

export const nuevoEjercicioAApi = (nuevo: NuevoEjercicio, empresaId: number | null) => ({
    id: nuevo.id,
    empresa_id: String(empresaId ?? 1),
    nombre: nuevo.nombre,
    fecha_inicio: fechaAApi(nuevo.fechaInicio),
    fecha_fin: fechaAApi(nuevo.fechaFin),
    digitos_subcuenta: Number(nuevo.digitosSubcuenta),
    serie_ids: seriesDesdeTexto(nuevo.series),
});

export const generarPgcAApi = (datos: GenerarPgc): Record<string, string | number> =>
    datos.ejercicioOrigenId
        ? { ejercicio_origen_id: datos.ejercicioOrigenId }
        : { digitos_subcuenta: Number(datos.digitosSubcuenta) };

/** Crea el ejercicio y, como el botón «PGC» de Eneboo, su plan contable. */
export const postEjercicio = async (
    nuevo: NuevoEjercicio,
    empresaId: number | null
): Promise<string> => {
    await RestAPI.post(
        urls.EJERCICIO_ALTA,
        nuevoEjercicioAApi(nuevo, empresaId),
        "Error al crear el ejercicio",
    );
    await patchGenerarPgc(nuevo.id, {
        ejercicioOrigenId: nuevo.ejercicioOrigenPgc,
        digitosSubcuenta: nuevo.digitosSubcuenta,
    });
    return nuevo.id;
};

export const patchGenerarPgc = async (id: string, datos: GenerarPgc): Promise<void> => {
    await RestAPI.patch(
        `${baseUrl}/${id}/generar_pgc`,
        generarPgcAApi(datos),
        "Error al generar el plan contable",
    );
};

export const getEjercicioActual = async (): Promise<string | null> => {
    const respuesta = await RestAPI.get<{ datos: { ejercicio_id: string | null } }>(
        `${baseUrl}/actual`,
    );
    return respuesta.datos.ejercicio_id;
};

export const patchEjercicioActual = async (id: string): Promise<void> => {
    await RestAPI.patch(
        `${baseUrl}/actual`,
        { ejercicio_id: id },
        "Error al cambiar el ejercicio actual",
    );
};

export const opcionesCierreAApi = (opciones: OpcionesCierre) => ({
    fecha: fechaAApi(opciones.fecha),
    regularizar: opciones.regularizar,
    cerrar: opciones.cerrar,
    abrir: opciones.abrir,
    ...(opciones.ejercicioDestinoId
        ? { ejercicio_destino_id: opciones.ejercicioDestinoId }
        : {}),
    ignorar_cuentas_sin_codigo_balance: opciones.ignorarCuentasSinCodigoBalance,
});

interface ResultadoCierreApi {
    asiento_pyg_id: number | null;
    asiento_cierre_id: number | null;
    asiento_apertura_id: number | null;
    ejercicio_destino_id: string | null;
    ejercicio_destino_creado: boolean;
}

export const patchCerrarEjercicio = async (
    id: string,
    opciones: OpcionesCierre
): Promise<ResultadoCierre> => {
    // RestAPI.patch se declara sin respuesta, pero devuelve el JSON.
    const r = (await RestAPI.patch(
        `${baseUrl}/${id}/cerrar`,
        opcionesCierreAApi(opciones),
        "Error al cerrar el ejercicio",
    )) as unknown as ResultadoCierreApi;
    return {
        asientoPygId: r.asiento_pyg_id,
        asientoCierreId: r.asiento_cierre_id,
        asientoAperturaId: r.asiento_apertura_id,
        ejercicioDestinoId: r.ejercicio_destino_id,
        ejercicioDestinoCreado: r.ejercicio_destino_creado,
    };
};

export const patchDeshacerCierre = async (id: string): Promise<void> => {
    await RestAPI.patch(
        `${baseUrl}/${id}/deshacer_cierre`,
        {},
        "Error al deshacer el cierre",
    );
};
