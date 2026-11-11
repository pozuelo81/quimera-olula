import { MetaModelo } from "@olula/lib/dominio.ts";
import {
    AsientoDelEjercicio,
    DatosEjercicio,
    Ejercicio,
    NuevoEjercicio,
    OpcionesCierre,
    TipoAsientoEjercicio,
} from "./diseño.ts";

const DIGITOS_SUBCUENTA_DEFECTO = 10;

/** Prefijo del 409 con el que el servidor pide confirmar el cierre cuando hay
 * subcuentas sin código de balance (el Sí/No de Eneboo). */
export const AVISO_CUENTAS_SIN_CODIGO_BALANCE = "CUENTAS_SIN_CODIGO_BALANCE";

const dia = (anyo: number, mes: number, d: number): Date =>
    new Date(anyo, mes, d, 12, 0, 0);

export const ejercicioVacio = (): Ejercicio => ({
    id: "",
    nombre: "",
    empresaId: null,
    fechaInicio: new Date(),
    fechaFin: new Date(),
    estado: "ABIERTO",
    digitosSubcuenta: DIGITOS_SUBCUENTA_DEFECTO,
    planContable: "08",
    tienePgc: false,
    asientoAperturaId: null,
    asientoPygId: null,
    asientoCierreId: null,
});

export const etiquetaEjercicio = (e: Pick<Ejercicio, "id" | "nombre">): string =>
    e.nombre ? `${e.id} — ${e.nombre}` : e.id;

const ultimo = (ejercicios: Ejercicio[]): Ejercicio | undefined =>
    [...ejercicios].sort((a, b) => b.fechaFin.getTime() - a.fechaFin.getTime())[0];

const codigoSiguiente = (codigo: string): string =>
    /^\d+$/.test(codigo)
        ? String(Number(codigo) + 1).padStart(codigo.length, "0")
        : "";

/** ejercicios.qs::iniciaValoresCursor: empieza el día siguiente al fin del
 * último ejercicio y acaba el 31 de diciembre. Propone copiar el plan del
 * último ejercicio con PGC (si no hay ninguno, PGC nuevo). */
export const nuevoEjercicioPropuesto = (ejercicios: Ejercicio[]): NuevoEjercicio => {
    const previo = ultimo(ejercicios);
    const inicio = previo
        ? dia(previo.fechaFin.getFullYear(), previo.fechaFin.getMonth(), previo.fechaFin.getDate() + 1)
        : dia(new Date().getFullYear(), 0, 1);
    const id = previo ? codigoSiguiente(previo.id) : String(inicio.getFullYear());
    const conPgc = ultimo(ejercicios.filter((e) => e.tienePgc));
    return {
        id,
        nombre: id ? `EJERCICIO ${id}` : "",
        fechaInicio: inicio,
        fechaFin: dia(inicio.getFullYear(), 11, 31),
        digitosSubcuenta: conPgc?.digitosSubcuenta ?? DIGITOS_SUBCUENTA_DEFECTO,
        ejercicioOrigenPgc: conPgc?.id ?? "",
        series: "A",
    };
};

export const seriesDesdeTexto = (texto: string): string[] =>
    texto.split(/[\s,;]+/).map((s) => s.trim()).filter((s) => s.length > 0);

export const puedeGenerarPgc = (e: Ejercicio): boolean => !!e.id && !e.tienePgc;

/** «Cerrar Ejercicio» solo con el ejercicio abierto y «Reabrir Ejercicio»
 * solo con el ejercicio cerrado (co_masterasientosejer.qs::pbnCerrar_clicked). */
export const puedeCerrar = (e: Ejercicio): boolean =>
    !!e.id && e.estado === "ABIERTO";

export const puedeReabrir = (e: Ejercicio): boolean =>
    !!e.id && e.estado === "CERRADO";

/** Ejercicio siguiente (el primero que empieza después), o "" si hay que
 * crearlo: el servidor lo crea con el PGC de este. */
export const ejercicioSiguiente = (ejercicio: Ejercicio, ejercicios: Ejercicio[]): string => {
    const posteriores = ejercicios
        .filter((e) => e.fechaInicio.getTime() > ejercicio.fechaInicio.getTime())
        .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
    return posteriores[0]?.id ?? "";
};

/** Asientos enlazados al ejercicio (Eneboo `ejercicios.idasiento*`, pestaña
 * Asientos de ejercicios.ui): la apertura (si vino del cierre del anterior),
 * la regularización de pérdidas y ganancias y el cierre, los que haya. */
export const asientosDelEjercicio = (ejercicio: Ejercicio): AsientoDelEjercicio[] => {
    const asientos: [TipoAsientoEjercicio, string, number | null][] = [
        ["APERTURA", "Asiento de apertura", ejercicio.asientoAperturaId],
        ["REGULARIZACION", "Asiento de regularización (pérdidas y ganancias)", ejercicio.asientoPygId],
        ["CIERRE", "Asiento de cierre", ejercicio.asientoCierreId],
    ];
    return asientos
        .filter(([, , id]) => !!id)
        .map(([tipo, titulo, id]) => ({ tipo, titulo, asientoId: String(id) }));
};

/** «Ir a ver asiento»: Contabilidad > Asientos con el asiento abierto y el
 * listado filtrado por su ejercicio (`?id=` como el resto de pantallas). */
export const urlAsiento = (asientoId: string, ejercicioId: string): string => {
    const params = new URLSearchParams({ id: asientoId });
    if (ejercicioId) params.set("ejercicio_id", `eq__${ejercicioId}`);
    return `/contabilidad/asiento?${params.toString()}`;
};

export const opcionesCierreIniciales = (
    ejercicio: Ejercicio,
    ejercicios: Ejercicio[]
): OpcionesCierre => ({
    fecha: ejercicio.fechaFin,
    regularizar: !ejercicio.asientoPygId,
    cerrar: !ejercicio.asientoCierreId,
    abrir: true,
    ejercicioDestinoId: ejercicioSiguiente(ejercicio, ejercicios),
    ignorarCuentasSinCodigoBalance: false,
});

export const esAvisoCuentasSinCodigoBalance = (error: unknown): boolean => {
    const e = error as { estado?: number; descripcion?: string } | null;
    return e?.estado === 409
        && (e.descripcion ?? "").includes(AVISO_CUENTAS_SIN_CODIGO_BALANCE);
};

export const textoAviso = (error: unknown): string => {
    const descripcion = (error as { descripcion?: string } | null)?.descripcion ?? "";
    try {
        const json = JSON.parse(descripcion) as { detail?: string; mensaje?: string };
        return (json.detail ?? json.mensaje ?? descripcion)
            .replace(`${AVISO_CUENTAS_SIN_CODIGO_BALANCE}: `, "");
    } catch {
        return descripcion.replace(`${AVISO_CUENTAS_SIN_CODIGO_BALANCE}: `, "");
    }
};

export const datosEjercicio = (e: Ejercicio): DatosEjercicio => ({
    nombre: e.nombre,
    fechaInicio: e.fechaInicio,
    fechaFin: e.fechaFin,
    digitosSubcuenta: e.digitosSubcuenta,
});

/** ejercicios.mtd (nombre NOT NULL, 100) y ejercicios.qs::validaFechas /
 * validaSubcuenta. */
export const metaDatosEjercicio: MetaModelo<DatosEjercicio> = {
    campos: {
        nombre: { requerido: true, maximo: 100 },
        fechaInicio: { requerido: true, tipo: "fecha" },
        fechaFin: { requerido: true, tipo: "fecha" },
        digitosSubcuenta: { requerido: true, tipo: "numero" },
    },
    validacion: (m) => {
        if (m.fechaInicio > m.fechaFin) {
            return "La fecha de inicio del ejercicio debe ser menor que la de fin";
        }
        const digitos = Number(m.digitosSubcuenta);
        if (digitos < 5 || digitos > 15) {
            return "La longitud de la subcuenta debe estar entre 5 y 15 caracteres";
        }
        return true;
    },
};

const mismoDia = (a: Date, b: Date): boolean => a.toDateString() === b.toDateString();

/** Lo que cambia de la cabecera: nombre y fechas van a /comun/ejercicio_facturacion
 * y la longitud de subcuenta a /contabilidad/ejercicio. */
export const cambiosDatosEjercicio = (previo: DatosEjercicio, actual: DatosEjercicio) => ({
    ...(actual.nombre !== previo.nombre ? { nombre: actual.nombre.trim() } : {}),
    ...(!mismoDia(actual.fechaInicio, previo.fechaInicio) ? { fechaInicio: actual.fechaInicio } : {}),
    ...(!mismoDia(actual.fechaFin, previo.fechaFin) ? { fechaFin: actual.fechaFin } : {}),
    ...(Number(actual.digitosSubcuenta) !== Number(previo.digitosSubcuenta)
        ? { digitosSubcuenta: Number(actual.digitosSubcuenta) } : {}),
});
