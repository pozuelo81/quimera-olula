import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { cargarContexto, refrescarProyecto } from "./detalle.js";
import { ContextoDetalleProyecto, EstadoDetalleProyecto } from "./diseño.js";

export const getMaquina: () => Maquina<EstadoDetalleProyecto, ContextoDetalleProyecto> = () => {
    return {
        INICIAL: {
            proyecto_id_cambiado: [cargarContexto],
            proyecto_deseleccionado: [publicar('proyecto_deseleccionado', null)],
        },
        ABIERTO: {
            proyecto_guardado: [refrescarProyecto],
            borrado_solicitado: "BORRANDO",
            proyecto_id_cambiado: [cargarContexto],
        },
        BORRANDO: {
            proyecto_borrado: [publicar('proyecto_borrado', null), "INICIAL"],
            borrado_de_proyecto_cancelado: "ABIERTO",
        },
    };
};
