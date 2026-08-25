import { MetaModelo } from "@olula/lib/dominio.ts";
import { CambioAgente } from "./diseño.ts";

export const cambioAgenteVacio: CambioAgente = {
    agente_id: "",
    nombre_agente: "",
    por_comision: 0,
};

const onAgenteCambiado = (cambio: CambioAgente, campo: string, _: unknown, otros?: Record<string, unknown>) => {
    if (campo === "agente_id" && otros) {
        return {
            ...cambio,
            por_comision: otros.por_comision === undefined ? 0 : Number(otros.por_comision),
        };
    }
    return cambio;
};

export const metaCambioAgente: MetaModelo<CambioAgente> = {
    campos: {
        agente_id: { requerido: true },
        por_comision: { tipo: "decimal", requerido: false, decimales: 2, positivo: true, maximo: 100, bloqueado: true },
    },
    onChange: onAgenteCambiado,
};
