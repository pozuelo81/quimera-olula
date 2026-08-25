import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroMandato, EstadoMaestroMandato } from "./diseño.js";
import * as maestro from "./maestro.js";

export const getMaquina: () => Maquina<EstadoMaestroMandato, ContextoMaestroMandato> = () => {
    return {
        INICIAL: {
            mandato_seleccionado: [maestro.Mandatos.activar],
            mandato_deseleccionado: [maestro.Mandatos.desactivar],

            recarga_de_mandatos_solicitada: maestro.recargarMandatos,

            criteria_cambiado: [maestro.Mandatos.filtrar, maestro.recargarMandatos],

            siguiente_pagina: [maestro.Mandatos.filtrar, maestro.ampliarMandatos],
        },
    };
};
