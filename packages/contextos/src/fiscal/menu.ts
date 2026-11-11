/**
 * Fiscalidad: series, impuestos, ejercicios fiscales y tablas Veri*Factu
 * (en Eneboo, maestros del módulo principal de facturación).
 */
export const menuFiscal = {
    Fiscalidad: { icono: "menu_fiscalidad", area: "Comercial" },
    "Fiscalidad/Ejercicios fiscales": { url: "/fiscal/ejercicio", regla: "contabilidad.asiento" },
    "Fiscalidad/Series": { url: "/fiscal/serie", regla: "comun.serie" },
    "Fiscalidad/Impuestos": { url: "/fiscal/impuesto", regla: "comun.impuesto" },
    "Fiscalidad/Grupos contables Veri*Factu": {
        url: "/fiscal/grupo_iva_negocio",
        regla: "comun.grupo_iva_negocio",
    },
};
