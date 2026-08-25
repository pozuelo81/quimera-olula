import { RestAPI } from "@olula/lib/api/rest_api.js";
import ApiUrls from "../comun/urls.ts";
import { PatchAlbaranarPedido, PatchCerrarLineaPedido, PostAlbaranarPedidos } from "./diseño.ts";
import { transformarLineasAlbaran } from "./dominio.ts";

const baseUrl = new ApiUrls().PEDIDO;

export const patchAlbaranarPedido: PatchAlbaranarPedido = async (id, lineas) => {
    const cambios = { lineas: transformarLineasAlbaran(lineas) };
    const respuesta = (await RestAPI.patch(
        `${baseUrl}/${id}/albaranar`,
        cambios,
        "Error al albaranar el pedido"
    )) as unknown as
        | { datos: { albaran_id: string; codigo?: string } }
        | { albaran_id: string; codigo?: string };
    const datos = "datos" in respuesta ? respuesta.datos : respuesta;
    const albaranId = String(datos.albaran_id ?? "");
    return { id: albaranId, codigo: String(datos.codigo ?? albaranId) };
}

export const postAlbaranarPedidos: PostAlbaranarPedidos = async (pedidoIds) => {
    const respuesta = (await RestAPI.post(
        `${new ApiUrls().ALBARAN}/desde-pedidos`,
        { pedido_ids: pedidoIds },
        "Error al albaranar los pedidos"
    )) as unknown as
        | { datos: { albaran_id: string; codigo?: string } }
        | { albaran_id: string; codigo?: string };
    const datos = "datos" in respuesta ? respuesta.datos : respuesta;
    const id = String(datos.albaran_id ?? "");
    return { id, codigo: String(datos.codigo ?? id) };
}

export const patchCerrarLineaPedido: PatchCerrarLineaPedido = async (pedidoId, lineaId, cerrada) => {
    const datos = { cerrada };
    await RestAPI.patch(`${baseUrl}/${pedidoId}/linea/${lineaId}/cerrar`, { datos }, "Error al cambiar estado de línea");
}