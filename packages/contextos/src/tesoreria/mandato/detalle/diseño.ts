import { Mandato } from "../diseño.js";

export type EstadoDetalleMandato =
    | 'INICIAL'
    | 'ABIERTO';

export type ContextoDetalleMandato = {
    estado: EstadoDetalleMandato;
    mandato: Mandato;
};
