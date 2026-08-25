import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Proyecto } from "../diseño.js";

export type EstadoMaestroProyecto = 'INICIAL' | 'CREANDO';

export type ContextoMaestroProyecto = {
    estado: EstadoMaestroProyecto;
    proyectos: ListaActivaEntidades<Proyecto>;
};
