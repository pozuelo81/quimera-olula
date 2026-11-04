import { ReciboVenta } from "../diseño.js";

export type EstadoDetalleReciboVenta =
    | 'INICIAL'
    | 'ABIERTO' | 'VIENDO_TRAZA'
    | 'PAGANDO'
    | 'ENLACE_COBRO'
    | 'DESAGRUPANDO'
    | 'DEVOLVIENDO'
    | 'ANULANDO_PAGO'
    | 'CAMBIANDO';

export type ContextoDetalleReciboVenta = {
    estado: EstadoDetalleReciboVenta;
    recibo: ReciboVenta;
};
