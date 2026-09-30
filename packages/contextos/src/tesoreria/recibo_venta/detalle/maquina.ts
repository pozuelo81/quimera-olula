import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto, desagruparRecibo, devolverRecibo, pagarRecibo } from "./detalle.js";
import { ContextoDetalleReciboVenta, EstadoDetalleReciboVenta } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleReciboVenta, ContextoDetalleReciboVenta> = () => {
    return {
        INICIAL: {
            recibo_id_cambiado: [cargarContexto],

            recibo_deseleccionado: [
                publicar('recibo_deseleccionado', null),
            ],
        },

        ABIERTO: {

            traza_solicitada: "VIENDO_TRAZA",

            recibo_id_cambiado: [cargarContexto],

            recibo_deseleccionado: [
                publicar('recibo_deseleccionado', null),
            ],

            pagar_solicitado: 'PAGANDO',

            devolucion_solicitada: 'DEVOLVIENDO',

            desagrupado_solicitado: 'DESAGRUPANDO',
        },

        PAGANDO: {
            pago_confirmado: [pagarRecibo],

            pago_cancelado: 'ABIERTO',
        },

        DEVOLVIENDO: {
            devolucion_confirmada: [devolverRecibo],

            devolucion_cancelada: 'ABIERTO',
        },

        DESAGRUPANDO: {
            desagrupado_confirmado: [desagruparRecibo],

            desagrupado_cancelado: 'ABIERTO',
        },

        VIENDO_TRAZA: {

            traza_cerrada: "ABIERTO",
        },
    };
};
