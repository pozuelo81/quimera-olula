import { Direccion, Entidad } from "@olula/lib/diseño.ts";

export interface Venta extends Entidad {
    id: string;
    codigo: string;
    fecha: Date;
    agente_id: string;
    nombre_agente: string;
    divisa_id: string;
    tasa_conversion: number;
    total: number;
    neto: number;
    total_iva: number;
    total_irpf: number;
    total_recargo: number;
    total_divisa_empresa: number;
    dtoPorcentual: number;
    netoSinDto: number;
    forma_pago_id: string;
    nombre_forma_pago: string;
    grupo_iva_negocio_id: string;
    observaciones: string;
}

export interface LineaVenta extends Entidad {
    id: string;
    referencia: string | null;
    descripcion: string;
    descripcionArticulo: string | null;
    cantidad: number;
    pvp_unitario: number;
    dto_porcentual: number;
    dto_lineal: number;
    pvp_total: number;
    iva_incluido: boolean;
    grupo_iva_producto_id: string;
    tipo_irpf: number;
    tipo_recargo: number;
    tipo_iva: number;
    por_comision: number;
    importe_comision: number;
};

export type NuevaVenta = {
    cliente_id: string;
    direccion_id: string;
    empresa_id: string;
};

export type TipoArticuloLinea = "registrado" | "libre" | "generico";

/**
 * Alta de documento para un cliente de paso: no hay ids de maestro, la dirección
 * viaja plana junto al nombre. Común a presupuesto, pedido y albarán.
 */
export type NuevaVentaClienteNoRegistrado = {
    empresa_id: string;
    nombre_cliente: string;
    id_fiscal: string;
    nombre_via: string;
    tipo_via?: string;
    numero?: string;
    otros?: string;
    cod_postal?: string;
    ciudad?: string;
    provincia?: string;
    pais_id?: string;
    apartado?: string;
    telefono?: string;
};

export type CambioClienteVenta = {
    cliente_id?: string;
    nombre_cliente?: string;
    direccion_id?: string;
    id_fiscal?: string;
    nombre_via?: string;
    tipo_via?: string;
    numero?: string;
    otros?: string;
    cod_postal?: string;
    ciudad?: string;
    provincia?: string;
    pais_id?: string;
    apartado?: string;
    telefono?: string;
};

export type NuevaLineaVenta = {
    referencia: string;
    cantidad: number;
};

/**
 * Línea sin artículo de catálogo. El servidor no exige `articulo_id`: basta con
 * descripción, cantidad y pvp_unitario (que puede ser 0).
 */
export type NuevaLineaLibreVenta = {
    descripcion: string;
    cantidad: number;
    pvp_unitario: number;
};

/**
 * Tipos dominio (camelCase) para el alta de línea — comunes a todos los
 * documentos de venta. Se convierten a los tipos API con `altaLineaApi`.
 */
export interface ArticuloLineaRegistrado {
    articuloId: string;
    pvpUnitario?: number;
}
export interface ArticuloLineaGenerico extends ArticuloLineaRegistrado {
    descripcion: string;
}
export interface ArticuloLineaLibre {
    descripcion: string;
    pvpUnitario: number;
}
export type ArticuloLinea =
    | ArticuloLineaRegistrado
    | ArticuloLineaGenerico
    | ArticuloLineaLibre;

/** Tipo dominio unificado para el alta de línea (input de `altaLineaApi`). */
export type AltaLineaVenta = {
    articulo: ArticuloLinea;
    cantidad: number;
};

/**
 * Cuerpo de un alta de línea tal y como lo espera el servidor: el bloque
 * `articulo` es excluyente (id de catálogo o descripción con precio) y la
 * cantidad va fuera de él. Común a presupuesto, pedido, albarán y factura.
 */



export type ClienteVenta = {
    cliente_id: string | null;
    nombre_cliente: string;
    id_fiscal: string;
    direccion_id: string | null;
    direccion: Direccion;
}

/** Extiende cualquier LineaVenta concreta con el campo de UI `tipoArticulo`. */
export type ConTipoArticulo<T extends LineaVenta> = T & { tipoArticulo: TipoArticuloLinea };

/**
 * Modelo de UI compartido para el alta de línea en todos los documentos de venta.
 * Independiente del tipo concreto de documento (pedido, presupuesto, albarán, factura).
 */
export type ModeloNuevaLinea = {
    tipoArticulo: TipoArticuloLinea;
    referencia: string | null;
    descripcionArticulo: string | null;
    descripcion: string | null;
    cantidad: number;
    pvp_unitario: number | null;
};
