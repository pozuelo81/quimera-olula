import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Remesa } from "../diseño.js";
import { getRemesas } from "../infraestructura.js";
import { ContextoMaestroRemesa, EstadoMaestroRemesa } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroRemesa, ContextoMaestroRemesa>;

const conRemesas = (fn: ProcesarListaActivaEntidades<Remesa>) =>
    (ctx: ContextoMaestroRemesa) => ({ ...ctx, remesas: fn(ctx.remesas) });

export const Remesas = accionesListaActivaEntidades(conRemesas);

export const recargarRemesas: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getRemesas(criteria);
    return Remesas.recargar(contexto, resultado);
};

export const ampliarRemesas: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getRemesas(criteria);
    return Remesas.ampliar(contexto, resultado);
};
