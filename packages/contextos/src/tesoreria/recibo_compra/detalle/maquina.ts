import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto } from "./detalle.js";
import { ContextoDetalleReciboCompra, EstadoDetalleReciboCompra } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleReciboCompra, ContextoDetalleReciboCompra> = () => {
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
        },

        VIENDO_TRAZA: {

            traza_cerrada: "ABIERTO",
        },
    };
};
