import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { fechaDesdeApi } from "../comun/infraestructura.js";
import ApiUrls from "../comun/urls.js";
import { GetReciboCompra, GetRecibosCompra, ReciboCompra } from "./diseño.js";
import { getTraza } from "#/comun/componentes/traza/infraestructura.ts";

export interface ReciboCompraApi {
    id: string;
    factura_id: string | null;
    codigo: string;
    fecha_emision: string | null;
    fecha_vencimiento: string | null;
    estado: string;
    importe: number;
    proveedor_id: string | null;
    nombre_proveedor: string;
    id_fiscal: string;
}

const baseUrl = new ApiUrls().RECIBO_COMPRA;

export const reciboCompraDesdeApi = (api: ReciboCompraApi): ReciboCompra => ({
    id: api.id,
    facturaId: api.factura_id,
    codigo: api.codigo,
    fechaEmision: fechaDesdeApi(api.fecha_emision),
    fechaVencimiento: fechaDesdeApi(api.fecha_vencimiento),
    estado: api.estado,
    importe: api.importe,
    proveedorId: api.proveedor_id,
    nombreProveedor: api.nombre_proveedor,
    idFiscal: api.id_fiscal,
});

export const getReciboCompra: GetReciboCompra = async (id) => {
    return await RestAPI.getItem<ReciboCompra, ReciboCompraApi>(
        `${baseUrl}/${id}`,
        reciboCompraDesdeApi,
        "Error al obtener el recibo de pago"
    );
};

export const getRecibosCompra: GetRecibosCompra = async (criteria) => {
    return await RestAPI.getQuery<ReciboCompra, ReciboCompraApi>(
        baseUrl,
        criteria,
        reciboCompraDesdeApi,
        "Error al obtener los recibos de pago"
    );
};

export const getTrazaReciboCompra = (id: string): Promise<unknown> => getTraza(`${baseUrl}/${id}`);
