import { ReciboVenta } from "../diseño.js";

export type EstadoDetalleReciboVenta =
    | 'INICIAL'
    | 'ABIERTO' | 'VIENDO_TRAZA'
    | 'PAGANDO'
    | 'DESAGRUPANDO'
    | 'DEVOLVIENDO';

export type ContextoDetalleReciboVenta = {
    estado: EstadoDetalleReciboVenta;
    recibo: ReciboVenta;
};
