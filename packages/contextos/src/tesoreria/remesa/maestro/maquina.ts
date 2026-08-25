import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroRemesa, EstadoMaestroRemesa } from "./diseño.js";
import * as maestro from "./maestro.js";

export const getMaquina: () => Maquina<EstadoMaestroRemesa, ContextoMaestroRemesa> = () => {
    return {
        INICIAL: {
            remesa_seleccionada: [maestro.Remesas.activar],
            remesa_deseleccionada: [maestro.Remesas.desactivar],

            recarga_de_remesas_solicitada: maestro.recargarRemesas,

            criteria_cambiado: [maestro.Remesas.filtrar, maestro.recargarRemesas],

            siguiente_pagina: [maestro.Remesas.filtrar, maestro.ampliarRemesas],
        },
    };
};
