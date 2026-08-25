import { idFiscalValido, tipoIdFiscalValido } from "#/valores/idfiscal.ts";
import { Modelo } from "@olula/lib/diseño.ts";
import { MetaCampo, MetaModelo } from "@olula/lib/dominio.ts";
import { CambioIdFiscal } from "./diseño.ts";

export const cambioIdFiscalVacio: CambioIdFiscal = {
    tipo_id_fiscal: "",
    id_fiscal: "",
};

export const validacionTipoIdFiscal = (modelo: CambioIdFiscal): string | boolean =>
    tipoIdFiscalValido(modelo.tipo_id_fiscal);

export const validacionIdFiscal = (modelo: CambioIdFiscal): string | boolean =>
    idFiscalValido(modelo.tipo_id_fiscal)(modelo.id_fiscal);

export const idFiscalCompletoValido = (modelo: CambioIdFiscal): boolean =>
    validacionTipoIdFiscal(modelo) === true && validacionIdFiscal(modelo) === true;

export const camposIdFiscal = <T extends Modelo & CambioIdFiscal>(
    bloqueado = false
): Record<string, MetaCampo<T>> => ({
    tipo_id_fiscal: {
        requerido: true,
        bloqueado,
        validacion: validacionTipoIdFiscal,
    },
    id_fiscal: {
        requerido: true,
        bloqueado,
        validacion: validacionIdFiscal,
    },
});

export const metaCambioIdFiscal: MetaModelo<CambioIdFiscal & Modelo> = {
    campos: camposIdFiscal<CambioIdFiscal & Modelo>(),
};
