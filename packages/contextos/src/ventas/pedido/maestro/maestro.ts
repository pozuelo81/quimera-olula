import { pedidoEsEditable } from "#/ventas/albaranarPedido/detalle/dominio.ts";
import { EstadoDocumento } from "#/ventas/comun/componentes/TarjetaDocumentoVenta.tsx";
import { postAlbaranarPedidos } from "#/ventas/albaranarPedido/infraestructura.ts";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Pedido } from "../diseño.ts";
import { getPedidos } from "../infraestructura.ts";
import { ContextoMaestroPedido, EstadoMaestroPedido } from "./diseño.ts";

type ProcesarPedidos = ProcesarContexto<EstadoMaestroPedido, ContextoMaestroPedido>;

const conPedidos = (fn: ProcesarListaActivaEntidades<Pedido>) => (ctx: ContextoMaestroPedido) => ({ ...ctx, pedidos: fn(ctx.pedidos) });

export const Pedidos = accionesListaActivaEntidades(conPedidos);

export const recargarPedidos: ProcesarPedidos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidos(criteria.filtro, criteria.orden, criteria.paginacion);

    return Pedidos.recargar(contexto, resultado);
}

export const ampliarPedidos: ProcesarPedidos = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidos(criteria.filtro, criteria.orden, criteria.paginacion);

    return Pedidos.ampliar(contexto, resultado);
}

export const estadoServidoPedido = (pedido: { servido?: string }): EstadoDocumento => {
    const servido = pedido.servido?.toUpperCase();
    if (servido === 'TOTAL' || servido === 'SERVIDO') return "cerrado";
    if (servido === 'PARCIAL') return "parcial";
    return "pendiente";
};

export const puedeAlbaranarse = (pedido: Pedido): boolean => pedidoEsEditable(pedido);

export const todosPuedenAlbaranarse = (ids: string[], pedidos: Pedido[]): boolean => {
    if (ids.length === 0) return false;
    return ids.every(id => {
        const pedido = pedidos.find(p => p.id === id);
        return pedido !== undefined && puedeAlbaranarse(pedido);
    });
}

export const agruparPorCliente = (ids: string[], pedidos: Pedido[]): string[][] => {
    const grupos = new Map<string, string[]>();

    ids.forEach(id => {
        const pedido = pedidos.find(p => p.id === id);
        if (!pedido) return;
        const clave = `${pedido.cliente.cliente_id}|${pedido.forma_pago_id}`;
        grupos.set(clave, [...(grupos.get(clave) ?? []), id]);
    });

    return [...grupos.values()];
}

export const albaranarPedidos: ProcesarPedidos = async (contexto) => {
    const grupos = agruparPorCliente(contexto.seleccionados, contexto.pedidos.lista);
    const resultados = await Promise.allSettled(
        grupos.map((ids) => postAlbaranarPedidos(ids))
    );

    const { filtro, orden, paginacion } = contexto.pedidos.criteria;
    const lista = await getPedidos(filtro, orden, paginacion);
    const recargado = await Pedidos.recargar(contexto, lista) as ContextoMaestroPedido;

    const albaranesCreados = resultados
        .filter((resultado) => resultado.status === "fulfilled")
        .map((resultado) => resultado.value);

    const fallidos = resultados.flatMap((resultado, indice) =>
        resultado.status === "rejected"
            ? [`${grupos[indice].length} pedido(s): ${mensajeDeError(resultado.reason)}`]
            : []
    );

    return {
        ...recargado,
        estado: "ALBARANES_CREADOS" as EstadoMaestroPedido,
        seleccionados: [],
        albaranesCreados,
        fallidos,
    };
}

const mensajeDeError = (error: unknown): string =>
    error instanceof Error ? error.message : String(error);
