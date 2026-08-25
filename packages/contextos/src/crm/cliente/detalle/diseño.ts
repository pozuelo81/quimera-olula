import { Cliente } from "../diseño.ts";

export type EstadoDetalleCliente = "INICIAL" | "BORRANDO" | "CAMBIANDO_ID_FISCAL";

export type ContextoDetalleCliente = {
    estado: EstadoDetalleCliente;
    cliente: Cliente;
};