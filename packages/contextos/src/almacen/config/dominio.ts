import { ConfigAlmacen } from "./diseño.ts";

/** Los valores por defecto del escritorio (factalma_general.mtd). */
export const configAlmacenPorDefecto: ConfigAlmacen = {
    impuestoId: "",
    usarIvaDefecto: false,
};

/** Usar el IVA por defecto sin haber elegido impuesto no tiene efecto: se avisa. */
export const avisoIvaDefecto = (config: ConfigAlmacen): string =>
    config.usarIvaDefecto && !config.impuestoId
        ? "Elige el I.V.A. por defecto: sin él la opción no tiene efecto."
        : "";
