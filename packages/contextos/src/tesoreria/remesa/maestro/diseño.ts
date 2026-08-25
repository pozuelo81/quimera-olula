import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Remesa } from "../diseño.js";

export type EstadoMaestroRemesa = 'INICIAL';

export type ContextoMaestroRemesa = {
    estado: EstadoMaestroRemesa;
    remesas: ListaActivaEntidades<Remesa>;
};
