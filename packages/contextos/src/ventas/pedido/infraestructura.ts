import { empresaActual } from "#/valores/empresaActual.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Direccion, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import { FactoryObj } from "@olula/lib/factory_ctx.tsx";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import ApiUrls from "../comun/urls.ts";
import { direccionVacia, payloadCambioCliente } from "../venta/dominio.ts";
import { altaLineaApi, articuloDeLinea } from "../venta/infraestructura.ts";
import { DeleteLinea, GetLineasPedido, GetPedido, GetPedidos, GetReportPedido, LineaPedido, PatchArticuloLinea, PatchCambiarAgente, PatchCambiarDivisa, PatchCantidadLinea, PatchClientePedido, PatchLinea, Pedido, PostLinea, PostPedido } from "./diseño.ts";

export interface LineaPedidoAPI {
  id: string;
  referencia: string | null;
  descripcion: string;
  descripcion_articulo: string | null
  cantidad: number;
  pvp_unitario: number;
  dto_porcentual: number;
  dto_lineal: number;
  pvp_total: number;
  grupo_iva_producto_id: string;
  iva_incluido: boolean;
  tipo_irpf: number;
  tipo_recargo: number;
  tipo_iva: number;
  por_comision: number;
  importe_comision: number;
};

interface PedidoAPI {
  id: string;
  codigo: string;
  fecha: string;
  fecha_salida: string | null;
  almacen_id: string;
  nombre_almacen: string;
  cliente_id: string;
  nombre_cliente: string;
  id_fiscal: string;
  direccion_id: string;
  direccion: Direccion;
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
  por_descuento: number;
  neto_sin_dto: number;
  forma_pago_id: string;
  nombre_forma_pago: string;
  grupo_iva_negocio_id: string;
  por_comision: number;
  observaciones: string;
  servido: string;
}

const baseUrl = new ApiUrls().PEDIDO;

type LineaPedidoDesdeApi = (l: LineaPedidoAPI) => LineaPedido;

export interface VentasPedidoInfra {
  linea_desde_api: LineaPedidoDesdeApi
}

const getInfra = (): VentasPedidoInfra => FactoryObj.app.Ventas?.pedido_infraestructura as VentasPedidoInfra

const lineaPedidoDesdeApi: LineaPedidoDesdeApi = (l) => {
  const infra = getInfra();
  return (infra?.linea_desde_api ?? lineaPedidoDesdeApiBase)(l)
};

const lineaPedidoDesdeApiBase: LineaPedidoDesdeApi = (l) => ({
  ...l,
  descripcionArticulo: l.descripcion_articulo
} as LineaPedido);

export const ventasPedidoInfra: VentasPedidoInfra = {
  linea_desde_api: lineaPedidoDesdeApiBase
}

export const pedidoDesdeAPI = (p: PedidoAPI): Pedido => ({
  ...p,
  fecha: new Date(Date.parse(p.fecha)),
  fecha_salida: p.fecha_salida ? new Date(Date.parse(p.fecha_salida)) : null,
  dtoPorcentual: p.por_descuento,
  netoSinDto: p.neto_sin_dto,
  cliente: {
    cliente_id: p.cliente_id ?? null,
    nombre_cliente: p.nombre_cliente ?? "",
    id_fiscal: p.id_fiscal ?? "",
    direccion_id: p.direccion_id ?? null,
    direccion: p.direccion ?? direccionVacia(),
  },
  lineas: [],
})

export const getPedido: GetPedido = async (id) => {
  return RestAPI.get<{ datos: PedidoAPI }>(
    `${baseUrl}/${id}`).then((respuesta) => {
      return pedidoDesdeAPI(respuesta.datos);
    });
}

export const getReportPedido: GetReportPedido = async (id) =>
  RestAPI.blob(`${baseUrl}/${id}/report`, "Error al obtener el report del pedido");

export const getPedidos: GetPedidos = async (
  filtro: Filtro,
  orden: Orden,
  paginacion: Paginacion
) => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: PedidoAPI[]; total: number }>(baseUrl + q);
  return { datos: respuesta.datos.map(pedidoDesdeAPI), total: respuesta.total };
};

export const postPedido: PostPedido = async (pedido) => {
  const payload = {
    cliente: payloadCambioCliente(pedido),
    empresa_id: empresaActual()
  }
  return await RestAPI.post(baseUrl, payload, "Error al crear pedido").then((respuesta) => respuesta.id);
}


export const patchCambiarCliente: PatchClientePedido = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: { cliente: payloadCambioCliente(cambio) }
  }, "Error al cambiar cliente del pedido");
}

export const patchCambiarDescuento = async (id: string, dto_porcentual: number): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      por_descuento: dto_porcentual,
    }
  }, "Error al cambiar descuento del pedido");
}

export const patchCambiarDivisa: PatchCambiarDivisa = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      divisa: {
        divisa_id: cambio.divisa_id,
        tasa_conversion: cambio.tasa_conversion,
      }
    }
  }, "Error al cambiar divisa del pedido");
}

export const patchCambiarAgente: PatchCambiarAgente = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      agente_id: cambio.agente_id,
      por_comision: cambio.por_comision,
    }
  }, "Error al cambiar agente del pedido");
}

export const getLineas: GetLineasPedido = async (id) =>
  await RestAPI.get<{ datos: LineaPedidoAPI[] }>(
    `${baseUrl}/${id}/linea`).then((respuesta) => {
      const lineas = respuesta.datos.map((d) => lineaPedidoDesdeApi(d));
      return lineas
    });


export const postLinea: PostLinea = async (id, linea) => {
  return await RestAPI.post(`${baseUrl}/${id}/linea`, {
    lineas: [altaLineaApi(linea)]
  }, "Error al crear linea de pedido").then((respuesta) => {
    const miRespuesta = respuesta as unknown as { ids: string[] };
    return miRespuesta.ids[0];
  });
}

export const patchArticuloLinea: PatchArticuloLinea = async (id, lineaId, referencia) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: referencia
      },
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}`, payload, "Error al actualizar artículo de la línea de pedido");
}

export const patchLinea: PatchLinea = async (id, linea) => {
  const payload = {
    cambios: {
      articulo: articuloDeLinea(linea),
      cantidad: linea.cantidad,
      pvp_unitario: linea.pvp_unitario,
      dto_porcentual: linea.dto_porcentual,
      dto_lineal: linea.dto_lineal,
      grupo_iva_producto_id: linea.grupo_iva_producto_id,
      tipo_irpf: linea.tipo_irpf,
      comision: linea.por_comision,
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar línea de pedido");
}

export const patchCantidadLinea: PatchCantidadLinea = async (id, linea, cantidad) => {
  const payload = {
    cambios: {
      cantidad: cantidad,
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar cantidad de la línea de pedido");
}

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/borrar`, {
    lineas: [lineaId]
  }, "Error al borrar línea de pedido");
}

export const patchPedido = async (id: string, pedido: Pedido) => {
  const api_payloadPatchPedido = FactoryObj.app.Ventas.api_payloadPatchPedido as (p: Pedido) => unknown;

  const payload = api_payloadPatchPedido(pedido) as Record<string, unknown>;

  await RestAPI.patch(`${baseUrl}/${id}`, payload,
    'Error al guardar el pedido'
  );
};


export { payloadPatchPedido } from "./infraestructura_base.ts";

export const borrarPedido = async (id: string) => {
  await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar pedido");
}
