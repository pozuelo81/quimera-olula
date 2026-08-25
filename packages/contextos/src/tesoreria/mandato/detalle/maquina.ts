import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto } from "./detalle.js";
import { ContextoDetalleMandato, EstadoDetalleMandato } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleMandato, ContextoDetalleMandato> = () => {
    return {
        INICIAL: {
            mandato_id_cambiado: [cargarContexto],

            mandato_deseleccionado: [
                publicar('mandato_deseleccionado', null),
            ],
        },

        ABIERTO: {
            mandato_id_cambiado: [cargarContexto],

            mandato_deseleccionado: [
                publicar('mandato_deseleccionado', null),
            ],
        },
    };
};
