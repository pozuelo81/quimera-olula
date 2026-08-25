import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Mandato } from "../diseño.js";
import { getMandatos } from "../infraestructura.js";
import { ContextoMaestroMandato, EstadoMaestroMandato } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroMandato, ContextoMaestroMandato>;

const conMandatos = (fn: ProcesarListaActivaEntidades<Mandato>) =>
    (ctx: ContextoMaestroMandato) => ({ ...ctx, mandatos: fn(ctx.mandatos) });

export const Mandatos = accionesListaActivaEntidades(conMandatos);

export const recargarMandatos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getMandatos(criteria);
    return Mandatos.recargar(contexto, resultado);
};

export const ampliarMandatos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getMandatos(criteria);
    return Mandatos.ampliar(contexto, resultado);
};
