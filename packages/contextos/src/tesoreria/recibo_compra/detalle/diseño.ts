import { ReciboCompra } from "../diseño.js";

export type EstadoDetalleReciboCompra =
    | 'INICIAL'
    | 'ABIERTO' | 'VIENDO_TRAZA';

export type ContextoDetalleReciboCompra = {
    estado: EstadoDetalleReciboCompra;
    recibo: ReciboCompra;
};
