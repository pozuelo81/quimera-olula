import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ReciboVenta } from "../diseño.js";
import { getRecibosVenta } from "../infraestructura.js";
import { ContextoMaestroReciboVenta, EstadoMaestroReciboVenta } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroReciboVenta, ContextoMaestroReciboVenta>;

const conRecibos = (fn: ProcesarListaActivaEntidades<ReciboVenta>) =>
    (ctx: ContextoMaestroReciboVenta) => ({ ...ctx, recibos: fn(ctx.recibos) });

export const Recibos = accionesListaActivaEntidades(conRecibos);

export const recargarRecibos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getRecibosVenta(criteria);
    return Recibos.recargar(contexto, resultado);
};

export const ampliarRecibos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getRecibosVenta(criteria);
    return Recibos.ampliar(contexto, resultado);
};
