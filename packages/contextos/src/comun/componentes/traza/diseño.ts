export type TipoDocumentoTraza =
    | "presupuesto_venta"
    | "pedido_venta"
    | "albaran_venta"
    | "factura_venta"
    | "recibo_cobro"
    | "pago_cobro"
    | "pedido_compra"
    | "albaran_compra"
    | "factura_compra"
    | "recibo_pago";

/**
 * Datos de un documento tal como llegan de `GET .../<id>/traza`. Además de los
 * comunes, cada tipo trae los suyos (cliente o proveedor, total o importe,
 * estado...). Si `visible` es false solo vienen tipo, id y código.
 */
export type DatosDocumentoTraza = {
    tipo: TipoDocumentoTraza;
    id: string;
    codigo: string;
    visible: boolean;
    fecha: string | null;
    [campo: string]: unknown;
};

export type NodoTraza = {
    clave: string;
    datos: DatosDocumentoTraza;
};

export type AristaTraza = {
    desde: string;
    hasta: string;
};

export type GrafoTraza = {
    raiz: string;
    nodos: NodoTraza[];
    aristas: AristaTraza[];
};

/** `fila` es la altura del nodo en su columna; puede ser fraccionaria (entre dos padres). */
export type NodoColocado = NodoTraza & {
    fila: number;
};

export type ColumnaTraza = {
    id: string;
    titulo: string;
    nodos: NodoColocado[];
};

export type DatoResumen = {
    etiqueta: string;
    valor: string;
};

export type UrlPorId = (id: string) => string;

/** URLs que cambia la app, por tipo. `null`: el tipo no tiene pantalla en esa app. */
export type UrlsTraza = Partial<Record<TipoDocumentoTraza, UrlPorId | null>>;

export type GetTraza = (id: string) => Promise<unknown>;
