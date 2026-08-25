import { MetaModelo } from "@olula/lib/dominio.ts";
import { CambioDivisa } from "./diseño.ts";

export const cambioDivisaVacio: CambioDivisa = {
    divisa_id: "",
    tasa_conversion: 0,
};

const onDivisaCambiada = (cambio: CambioDivisa, campo: string, _: unknown, otros?: Record<string, unknown>) => {
    if (campo === "divisa_id" && otros) {
        return {
            ...cambio,
            tasa_conversion: otros.tasa_conversion === undefined ? 0 : Number(otros.tasa_conversion),
        };
    }
    return cambio;
};

export const metaCambioDivisa: MetaModelo<CambioDivisa> = {
    campos: {
        divisa_id: { requerido: true },
        tasa_conversion: { tipo: "numero", requerido: true, positivo: true },
    },
    onChange: onDivisaCambiada,
};
