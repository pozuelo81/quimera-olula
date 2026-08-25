import { Proyecto } from "../diseño.js";

export type EstadoDetalleProyecto = 'INICIAL' | 'ABIERTO' | 'BORRANDO';

export type ContextoDetalleProyecto = {
    estado: EstadoDetalleProyecto;
    proyecto: Proyecto;
};
