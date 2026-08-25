import { Remesa } from "../diseño.js";

export type EstadoDetalleRemesa =
    | 'INICIAL'
    | 'ABIERTO';

export type ContextoDetalleRemesa = {
    estado: EstadoDetalleRemesa;
    remesa: Remesa;
};
