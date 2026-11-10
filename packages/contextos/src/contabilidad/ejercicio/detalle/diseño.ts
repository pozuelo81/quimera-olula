import { Ejercicio } from "../diseño.ts";

export type EstadoDetalleEjercicio =
    "INICIAL" | "ABIERTO" | "GENERANDO_PGC" | "CERRANDO" | "DESHACIENDO";

export type ContextoDetalleEjercicio = {
    estado: EstadoDetalleEjercicio;
    ejercicio: Ejercicio;
    /** Ejercicio siguiente, para enseñar la apertura que dejó el cierre. */
    siguiente: Ejercicio | null;
};
