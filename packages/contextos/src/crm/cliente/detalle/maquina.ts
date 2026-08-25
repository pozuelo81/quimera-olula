import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { cambiarCliente, cambiarIdFiscalCliente, cargarContexto, getContextoVacio } from "./detalle.ts";
import { ContextoDetalleCliente, EstadoDetalleCliente } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetalleCliente, ContextoDetalleCliente> = () => {
    return {
        INICIAL: {
            cliente_id_cambiado: cargarContexto,

            cliente_cambiado: cambiarCliente,

            edicion_cliente_cancelada: [getContextoVacio, publicar("cliente_deseleccionado", null)],

            borrado_cliente_solicitado: "BORRANDO",

            cambio_id_fiscal_solicitado: "CAMBIANDO_ID_FISCAL",
        },
        CAMBIANDO_ID_FISCAL: {
            cambio_id_fiscal_listo: [cambiarIdFiscalCliente],

            cambio_id_fiscal_cancelado: "INICIAL",
        },
        BORRANDO: {
            borrado_cliente_cancelado: "INICIAL",

            cliente_borrado: [getContextoVacio, publicar('cliente_borrado', (_, clienteId) => clienteId)],
        },
    }
}
