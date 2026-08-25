import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto } from "./detalle.js";
import { ContextoDetalleRemesa, EstadoDetalleRemesa } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleRemesa, ContextoDetalleRemesa> = () => {
    return {
        INICIAL: {
            remesa_id_cambiado: [cargarContexto],

            remesa_deseleccionada: [
                publicar('remesa_deseleccionada', null),
            ],
        },

        ABIERTO: {
            remesa_id_cambiado: [cargarContexto],

            remesa_deseleccionada: [
                publicar('remesa_deseleccionada', null),
            ],
        },
    };
};
