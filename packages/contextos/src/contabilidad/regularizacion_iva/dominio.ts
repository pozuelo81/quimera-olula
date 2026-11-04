import {
    NuevaRegularizacionIva,
    PeriodoRegularizacion,
    RegularizacionIva,
    Trimestre,
} from "./diseño.ts";

const MESES_TRIMESTRE: Record<Exclude<Trimestre, "OTRO">, number> = {
    T1: 0,
    T2: 3,
    T3: 6,
    T4: 9,
};

export const opcionesTrimestre = [
    { valor: "T1", descripcion: "1er trimestre" },
    { valor: "T2", descripcion: "2º trimestre" },
    { valor: "T3", descripcion: "3er trimestre" },
    { valor: "T4", descripcion: "4º trimestre" },
    { valor: "OTRO", descripcion: "Otro periodo" },
];

const fechaLocal = (anyo: number, mes: number, dia: number): Date =>
    new Date(anyo, mes, dia, 12, 0, 0);

/** Fechas del trimestre como `co_regiva.qs::calculateField`: del día 1 del
 * primer mes al último día del tercero. */
export const fechasTrimestre = (
    anyo: number,
    trimestre: Exclude<Trimestre, "OTRO">
): { fechaInicio: Date; fechaFin: Date } => {
    const mes = MESES_TRIMESTRE[trimestre];
    return {
        fechaInicio: fechaLocal(anyo, mes, 1),
        fechaFin: fechaLocal(anyo, mes + 3, 0),
    };
};

const anyoEjercicio = (ejercicioId: string): number => {
    const anyo = Number.parseInt(ejercicioId, 10);
    return Number.isNaN(anyo) ? new Date().getFullYear() : anyo;
};

/** Periodo a enviar: el del trimestre elegido o las fechas a mano. Sin fecha
 * de asiento se usa el fin del periodo, como propone Eneboo. */
export const periodoNuevaRegularizacion = (
    nueva: NuevaRegularizacionIva
): PeriodoRegularizacion => {
    const fechas =
        nueva.trimestre === "OTRO"
            ? { fechaInicio: nueva.fechaInicio, fechaFin: nueva.fechaFin }
            : fechasTrimestre(anyoEjercicio(nueva.ejercicioId), nueva.trimestre);
    return {
        ...fechas,
        fechaAsiento: nueva.fechaAsiento ?? fechas.fechaFin,
    };
};

/** Trimestre siguiente al último regularizado del ejercicio (Eneboo propone
 * empezar el día después de la última regularización). */
export const trimestreSiguiente = (
    regularizaciones: Pick<RegularizacionIva, "ejercicioId" | "periodo">[],
    ejercicioId: string
): Trimestre => {
    const hechos = regularizaciones
        .filter((r) => r.ejercicioId === ejercicioId)
        .map((r) => r.periodo);
    const siguiente = (["T1", "T2", "T3", "T4"] as const).find(
        (t) => !hechos.includes(t)
    );
    return siguiente ?? "OTRO";
};

export const etiquetaRegularizacionIva = (
    r: Pick<RegularizacionIva, "ejercicioId" | "periodo">
): string => `Regularización IVA ${r.ejercicioId} ${r.periodo}`;

export const regularizacionIvaVacia = (): RegularizacionIva => ({
    id: "",
    ejercicioId: "",
    periodo: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    fechaAsiento: new Date(),
    asientoId: "",
    numeroAsiento: null,
    importe: null,
    codigoSubcuentaDeudora: "",
    codigoSubcuentaAcreedora: "",
});
