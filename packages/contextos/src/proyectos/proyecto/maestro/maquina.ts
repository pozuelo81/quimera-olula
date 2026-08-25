import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroProyecto, EstadoMaestroProyecto } from "./diseño.js";
import * as maestro from "./maestro.js";

export const getMaquina: () => Maquina<EstadoMaestroProyecto, ContextoMaestroProyecto> = () => {
    return {
        INICIAL: {
            proyecto_seleccionado: [maestro.Proyectos.activar],
            proyecto_deseleccionado: [maestro.Proyectos.desactivar],
            proyecto_cambiado: [maestro.Proyectos.cambiar],
            proyecto_borrado: [maestro.Proyectos.quitar],
            recarga_de_proyectos_solicitada: maestro.recargarProyectos,
            criteria_cambiado: [maestro.Proyectos.filtrar, maestro.recargarProyectos],
            siguiente_pagina: [maestro.Proyectos.filtrar, maestro.ampliarProyectos],
            crear_proyecto_solicitado: "CREANDO",
        },
        CREANDO: {
            alta_de_proyecto_cancelada: "INICIAL",
            proyecto_creado: maestro.incluirProyectoCreadoPorId,
        },
    };
};
