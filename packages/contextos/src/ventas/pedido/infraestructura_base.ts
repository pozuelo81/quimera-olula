import { fechaAISO } from "../comun/dominio.ts";
import { Pedido } from "./diseño.ts";

type PedidoAPI = Pedido

export const pedidoDesdeAPI = (p: PedidoAPI): Pedido => p;

export const payloadPatchPedido = (pedido: Pedido) => {
    const payload = {
        cambios: {
            agente_id: pedido.agente_id,
            divisa: {
                divisa_id: pedido.divisa_id,
                tasa_conversion: pedido.tasa_conversion,
            },
            fecha: pedido.fecha,
            fecha_salida: fechaAISO(pedido.fecha_salida),
            almacen_id: pedido.almacen_id,
            cliente_id: pedido.cliente.cliente_id,
            nombre_cliente: pedido.cliente.nombre_cliente,
            id_fiscal: pedido.cliente.id_fiscal,
            direccion_id: pedido.cliente.direccion_id,
            forma_pago_id: pedido.forma_pago_id,
            grupo_iva_negocio_id: pedido.grupo_iva_negocio_id,
            por_comision: pedido.por_comision,
            observaciones: pedido.observaciones,
        },
    };

    return payload;
}