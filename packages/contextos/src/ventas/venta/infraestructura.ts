import { AltaLineaVenta, ArticuloLinea, ArticuloLineaGenerico, ArticuloLineaLibre, ArticuloLineaRegistrado, LineaVenta } from "./diseño.ts";
import { getTipoArticulo } from "./dominio.ts";

export interface ArticuloLineaRegistradoApi {
    articulo_id: string;
    pvp_unitario?: number;
}
export interface ArticuloLineaGenericoApi extends ArticuloLineaRegistradoApi {
    descripcion: string;
}
export interface ArticuloLineaLibreApi {
    descripcion: string;
    pvp_unitario: number;
}
export type ArticuloLineaApi =
    | ArticuloLineaRegistradoApi
    | ArticuloLineaGenericoApi
    | ArticuloLineaLibreApi;

export type AltaLineaVentaApi = {
    articulo: ArticuloLineaApi;
    cantidad: number;
};

export const articuloDeLinea = (
    linea: LineaVenta
) => {
    switch (getTipoArticulo(linea)) {
        case "generico":
            return { articulo_id: linea.referencia!, descripcion: linea.descripcion };
        case "registrado":
            return { articulo_id: linea.referencia! };
        case "libre":
            return { descripcion: linea.descripcion };
    }
}

const articuloAltaLineaApi = (articulo: ArticuloLinea): ArticuloLineaApi => {
    if (!('articuloId' in articulo)) return articuloAltaLibreApi(articulo);
    if ('descripcion' in articulo) return articuloAltaGenericoApi(articulo);
    return articuloAltaRegistradoApi(articulo);
};

const articuloAltaRegistradoApi = (a: ArticuloLineaRegistrado): ArticuloLineaRegistradoApi => ({
    articulo_id: a.articuloId,
    ...(a.pvpUnitario !== undefined ? { pvp_unitario: a.pvpUnitario } : {}),
});

const articuloAltaGenericoApi = (a: ArticuloLineaGenerico): ArticuloLineaGenericoApi => ({
    articulo_id: a.articuloId,
    descripcion: a.descripcion,
    ...(a.pvpUnitario !== undefined ? { pvp_unitario: a.pvpUnitario } : {}),
});

const articuloAltaLibreApi = (a: ArticuloLineaLibre): ArticuloLineaLibreApi => ({
    descripcion: a.descripcion,
    pvp_unitario: a.pvpUnitario,
});

/**
 * Convierte un alta de línea de dominio (camelCase) al cuerpo que espera el
 * servidor (snake_case). Común a los cuatro documentos de venta.
 */
export const altaLineaApi = ({ articulo, cantidad }: AltaLineaVenta): AltaLineaVentaApi => ({
    articulo: articuloAltaLineaApi(articulo),
    cantidad,
});