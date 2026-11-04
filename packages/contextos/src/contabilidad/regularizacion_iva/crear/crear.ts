import { MetaModelo } from "@olula/lib/dominio.js";
import { ejercicioActual } from "#/contabilidad/asiento/dominio.ts";
import { NuevaRegularizacionIva, RegularizacionIva } from "../diseño.ts";
import { fechasTrimestre, trimestreSiguiente } from "../dominio.ts";

export const metaNuevaRegularizacionIva: MetaModelo<NuevaRegularizacionIva> = {
    campos: {
        ejercicioId: { requerido: true, maximo: 4 },
        trimestre: { requerido: true, tipo: "selector" },
        fechaInicio: { requerido: false, tipo: "fecha" },
        fechaFin: { requerido: false, tipo: "fecha" },
        fechaAsiento: { requerido: false, tipo: "fecha" },
        codigoSubcuentaDeudora: { requerido: false },
        codigoSubcuentaAcreedora: { requerido: false },
    },
    validacion: (m) =>
        m.trimestre !== "OTRO" || m.fechaInicio <= m.fechaFin
            ? true
            : "La fecha de inicio debe ser anterior a la de fin",
};

export const nuevaRegularizacionIvaInicial = (
    regularizaciones: Pick<RegularizacionIva, "ejercicioId" | "periodo">[] = [],
    ejercicioId: string = ejercicioActual(),
): NuevaRegularizacionIva => {
    const trimestre = trimestreSiguiente(regularizaciones, ejercicioId);
    const fechas = fechasTrimestre(
        Number.parseInt(ejercicioId, 10) || new Date().getFullYear(),
        trimestre === "OTRO" ? "T1" : trimestre
    );
    return {
        ejercicioId,
        trimestre,
        ...fechas,
        fechaAsiento: null,
        codigoSubcuentaDeudora: "",
        codigoSubcuentaAcreedora: "",
    };
};
