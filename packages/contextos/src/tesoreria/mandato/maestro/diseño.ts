import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Mandato } from "../diseño.js";

export type EstadoMaestroMandato = 'INICIAL';

export type ContextoMaestroMandato = {
    estado: EstadoMaestroMandato;
    mandatos: ListaActivaEntidades<Mandato>;
};
