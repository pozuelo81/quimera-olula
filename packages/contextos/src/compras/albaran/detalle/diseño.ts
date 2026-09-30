import { ListaEntidades } from "@olula/lib/ListaEntidades.ts";
import { FacturaCreada } from "../../factura/diseño.ts";
import { Albaran, LineaAlbaran } from "../diseño.ts";

export type EstadoDetalleAlbaran =
    | 'INICIAL'
    | 'ABIERTO' | 'VIENDO_TRAZA'
    | 'BORRANDO'
    | 'FACTURANDO'
    | 'FACTURA_CREADA'
    | 'CAMBIANDO_PROVEEDOR'
    | 'CAMBIANDO_DIVISA'
    | 'CREANDO_LINEA'
    | 'CAMBIANDO_LINEA'
    | 'BORRANDO_LINEA';

export type ContextoDetalleAlbaran = {
    estado: EstadoDetalleAlbaran;
    albaran: Albaran;
    facturaCreada: FacturaCreada | null;
    lineas: ListaEntidades<LineaAlbaran>;
};
