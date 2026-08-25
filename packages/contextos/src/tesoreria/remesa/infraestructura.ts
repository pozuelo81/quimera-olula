import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { fechaDesdeApi } from "../comun/infraestructura.js";
import ApiUrls from "../comun/urls.js";
import { GetRemesa, GetRemesas, Remesa } from "./diseño.js";

export interface RemesaApi {
    id: string;
    fecha: string | null;
    fecha_cargo: string | null;
    total: number;
    divisa_id: string;
    cuenta_id: string;
    estado: string;
    empresa_id: string;
}

const baseUrl = new ApiUrls().REMESA;

export const remesaDesdeApi = (api: RemesaApi): Remesa => ({
    id: api.id,
    fecha: fechaDesdeApi(api.fecha),
    fechaCargo: fechaDesdeApi(api.fecha_cargo),
    total: api.total,
    divisaId: api.divisa_id,
    cuentaId: api.cuenta_id,
    estado: api.estado,
    empresaId: api.empresa_id,
});

export const getRemesa: GetRemesa = async (id) => {
    return await RestAPI.getItem<Remesa, RemesaApi>(
        `${baseUrl}/${id}`,
        remesaDesdeApi,
        "Error al obtener la remesa"
    );
};

export const getRemesas: GetRemesas = async (criteria) => {
    return await RestAPI.getQuery<Remesa, RemesaApi>(
        baseUrl,
        criteria,
        remesaDesdeApi,
        "Error al obtener las remesas"
    );
};
