import { Maquina } from "@olula/lib/diseño.js";
import { publicar } from "@olula/lib/dominio.js";
import { ContextoAlbaran, EstadoAlbaran } from "./diseño.ts";
import {
    abiertoOFacturado,
    activarLinea,
    borrarAlbaran,
    borrarLinea,
    cambiarAgente,
    cambiarAlbaran,
    cambiarCantidadLinea,
    cambiarCliente,
    cambiarDescuento,
    cambiarDivisa,
    cambiarLinea,
    cancelarCambioAlbaran,
    cargarContexto,
    crearLinea,
    facturarAlbaran,
    getContextoVacio,
    refrescarAlbaran,
    refrescarLineas
} from "./detalle.ts";


export const getMaquina: () => Maquina<EstadoAlbaran, ContextoAlbaran> = () => {

    return {

        INICIAL: {

            albaran_id_cambiado: [cargarContexto],

            albaran_deseleccionado: [
                getContextoVacio,
                publicar('albaran_deseleccionado', null)
            ]
        },

        ABIERTO: {

            linea_creada: [
                refrescarAlbaran,
                refrescarLineas
            ],

            alta_linea_solicitada: "CREANDO_LINEA",

            baja_linea_solicitada: "BORRANDO_LINEA",

            cambio_linea_solicitado: "CAMBIANDO_LINEA",

            borrar_solicitado: "BORRANDO_ALBARAN",

            facturar_solicitado: "FACTURANDO_ALBARAN",

            cambio_cliente_solicitado: "CAMBIANDO_CLIENTE",

            cambio_divisa_solicitado: "CAMBIANDO_DIVISA",

            cambio_agente_solicitado: "CAMBIANDO_AGENTE",

            descuento_solicitado: "CAMBIANDO_DESCUENTO",

            albaran_cargado: [abiertoOFacturado],

            albaran_cambiado: [refrescarAlbaran, "ABIERTO"],

            edicion_de_albaran_lista: [cambiarAlbaran],

            edicion_de_albaran_cancelada: [cancelarCambioAlbaran],

            linea_seleccionada: [activarLinea],

            cambio_cantidad_linea_solicitado: cambiarCantidadLinea,

            albaran_deseleccionado: [
                getContextoVacio,
                publicar('albaran_deseleccionado', null)
            ]
        },

        FACTURADO: {

            albaran_cargado: [abiertoOFacturado],

            albaran_deseleccionado: [
                getContextoVacio,
                publicar('albaran_deseleccionado', null)
            ]
        },

        BORRANDO_ALBARAN: {

            borrado_de_albaran_listo: borrarAlbaran,

            borrar_cancelado: "ABIERTO",
        },

        FACTURANDO_ALBARAN: {

            facturacion_lista: [facturarAlbaran],

            facturar_cancelado: "ABIERTO",
        },

        FACTURA_CREADA: {

            factura_creada_cerrada: [abiertoOFacturado],
        },

        CAMBIANDO_CLIENTE: {

            cambio_cliente_listo: [cambiarCliente, "ABIERTO"],

            cambio_cliente_cancelado: "ABIERTO",
        },

        CAMBIANDO_DIVISA: {

            cambio_divisa_listo: [cambiarDivisa],

            cambio_divisa_cancelado: "ABIERTO",
        },

        CAMBIANDO_AGENTE: {

            cambio_agente_listo: [cambiarAgente],

            cambio_agente_cancelado: "ABIERTO",
        },

        CAMBIANDO_DESCUENTO: {

            descuento_aplicado: [cambiarDescuento],

            descuento_cancelado: "ABIERTO",
        },

        CREANDO_LINEA: {

            alta_linea_lista: [crearLinea],

            crear_linea_cancelado: "ABIERTO",
        },

        CAMBIANDO_LINEA: {

            linea_actualizada: cambiarLinea,

            editar_linea_cancelado: "ABIERTO",
        },

        BORRANDO_LINEA: {

            linea_borrada: borrarLinea,

            borrar_linea_cancelado: "ABIERTO",
        },

    }
}
