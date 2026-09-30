import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import {
    cambiarDivisa,
    cambiarProveedor,
    cargarContexto,
    cerrarLineaProceso,
    limpiarContexto,
    Lineas,
    onLineaBorrada,
    onLineaCambiada,
    onLineaCreada,
    refrescarPedido,
} from "./detalle.ts";
import { ContextoDetallePedido, EstadoDetallePedido } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoDetallePedido, ContextoDetallePedido> = () => {
    return {
        INICIAL: {
            pedido_id_cambiado: [cargarContexto],

            pedido_deseleccionado: [
                limpiarContexto,
                publicar('pedido_deseleccionado', null),
            ],
        },

        ABIERTO: {

            traza_solicitada: "VIENDO_TRAZA",

            pedido_id_cambiado: [cargarContexto],

            pedido_guardado: [refrescarPedido],

            pedido_deseleccionado: [
                limpiarContexto,
                publicar('pedido_deseleccionado', null),
            ],

            borrado_solicitado: "BORRANDO",

            cambio_proveedor_solicitado: "CAMBIANDO_PROVEEDOR",
            cambio_divisa_solicitado: "CAMBIANDO_DIVISA",

            linea_seleccionada: [Lineas.activar],
            alta_linea_solicitada: "CREANDO_LINEA",
            cambio_linea_solicitado: "CAMBIANDO_LINEA",
            baja_linea_solicitada: "BORRANDO_LINEA",
            cierre_linea_solicitado: [cerrarLineaProceso],
        },

        CAMBIANDO_DIVISA: {
            cambio_divisa_listo: [cambiarDivisa],
            cambio_divisa_cancelado: "ABIERTO",
        },

        CAMBIANDO_PROVEEDOR: {
            cambio_proveedor_listo: [cambiarProveedor],
            cambio_proveedor_cancelado: "ABIERTO",
        },

        BORRANDO: {
            pedido_borrado: [
                publicar<EstadoDetallePedido, ContextoDetallePedido>(
                    'pedido_borrado',
                    (contexto) => contexto.pedido.id
                ),
                limpiarContexto,
            ],

            borrado_cancelado: "ABIERTO",
        },

        CREANDO_LINEA: {
            linea_creada: [onLineaCreada, "ABIERTO"],
            alta_de_linea_cancelada: "ABIERTO",
        },

        CAMBIANDO_LINEA: {
            linea_cambiada: [onLineaCambiada, "ABIERTO"],
            cambio_de_linea_cancelado: "ABIERTO",
        },

        BORRANDO_LINEA: {
            linea_borrada: [onLineaBorrada, "ABIERTO"],
            borrado_de_linea_cancelado: "ABIERTO",
        },

        VIENDO_TRAZA: {

            traza_cerrada: "ABIERTO",
        },
    };
};
