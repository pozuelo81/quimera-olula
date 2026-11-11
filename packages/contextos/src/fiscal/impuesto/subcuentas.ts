import { SufijoSubcuenta, TipoBienes } from "./diseño.ts";

export const TIPOS_BIENES: TipoBienes[] = ["Corrientes", "De Inversion", "Servicios", "No Deducible", "No Sujeto"];

/** Subcuentas de impuestos.ui con el alias de impuestos.mtd. */
export const SUBCUENTAS: { sufijo: SufijoSubcuenta; etiqueta: string }[] = [
    { sufijo: "rep", etiqueta: "I.V.A. Repercutido (IVAREP)" },
    { sufijo: "sop", etiqueta: "I.V.A. Soportado (IVASOP)" },
    { sufijo: "acr", etiqueta: "H.P. Acreedor I.V.A. (IVAACR)" },
    { sufijo: "deu", etiqueta: "H.P. Deudor I.V.A. (IVADEU)" },
    { sufijo: "ivadevadue", etiqueta: "I.V.A. Rep. Adquisiciones Intracomunitarias (IVARUE)" },
    { sufijo: "ivadedadue", etiqueta: "I.V.A. Sop. Adquisiciones Intracomunitarias (IVASUE)" },
    { sufijo: "ivadeventue", etiqueta: "I.V.A. Rep. Entregas Intracomunitarias (IVAEUE)" },
    { sufijo: "ivarepspue", etiqueta: "I.V.A. Rep. Servicios Intracomunitarios (IVARSE)" },
    { sufijo: "ivasopspue", etiqueta: "I.V.A. Sop. Servicios Intracomunitarios (IVASSE)" },
    { sufijo: "ivarepesue", etiqueta: "I.V.A. Rep. Entrega de Servicios Intracomunitarios (IVARES)" },
    { sufijo: "ivasopimp", etiqueta: "I.V.A. Sop. Importaciones (IVASIM)" },
    { sufijo: "ivarepimp", etiqueta: "I.V.A. Rep. Importaciones Diferido (IVARIM)" },
    { sufijo: "ivarepspim", etiqueta: "I.V.A. Rep. Servicios Importación (IVARSI)" },
    { sufijo: "ivasopspim", etiqueta: "I.V.A. Sop. Servicios Importación (IVASSI)" },
    { sufijo: "ivarepexp", etiqueta: "I.V.A. Rep. Exportaciones (IVARXP)" },
    { sufijo: "ivasopexe", etiqueta: "I.V.A. Sop. Exento (IVASEX)" },
    { sufijo: "ivarepexe", etiqueta: "I.V.A. Rep. Exento (IVAREX)" },
    { sufijo: "ivarepre", etiqueta: "Recargo equivalencia (IVARRE)" },
    { sufijo: "ivasopagra", etiqueta: "I.V.A. Sop. Reg. Agrario (IVASRA)" },
];

