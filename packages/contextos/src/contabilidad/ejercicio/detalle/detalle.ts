import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejercicioVacio } from "../dominio.ts";
import { Ejercicio } from "../diseño.ts";
import { getEjercicio, getEjercicioSiguiente } from "../infraestructura.ts";
import { ContextoDetalleEjercicio, EstadoDetalleEjercicio } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleEjercicio, ContextoDetalleEjercicio>;

export const contextoDetalleEjercicioInicial: ContextoDetalleEjercicio = {
    estado: "INICIAL",
    ejercicio: ejercicioVacio(),
    siguiente: null,
};

/** Solo hace falta el siguiente si este está cerrado (su apertura sale del
 * asiento de cierre). */
const leerSiguiente = async (ejercicio: Ejercicio): Promise<Ejercicio | null> =>
    ejercicio.asientoCierreId ? getEjercicioSiguiente(ejercicio) : null;

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    if (!id) {
        return { ...contexto, estado: "INICIAL", ejercicio: ejercicioVacio(), siguiente: null };
    }
    const ejercicio = await getEjercicio(id);
    return { ...contexto, estado: "ABIERTO", ejercicio, siguiente: await leerSiguiente(ejercicio) };
};

/** Recarga el ejercicio y avisa al maestro: el cierre cambia también otros. */
export const refrescarEjercicio: ProcesarDetalle = async (contexto) => {
    const ejercicio = await getEjercicio(contexto.ejercicio.id);
    const siguiente = await leerSiguiente(ejercicio);
    return [
        { ...contexto, estado: "ABIERTO", ejercicio, siguiente },
        [["ejercicio_cambiado", ejercicio]],
    ];
};
