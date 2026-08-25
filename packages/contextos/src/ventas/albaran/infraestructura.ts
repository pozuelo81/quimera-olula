import { empresaActual } from "#/valores/empresaActual.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Direccion, Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { esVerdadero, normalizarHora } from "../comun/dominio.ts";
import ApiUrls from "../comun/urls.ts";
import { direccionVacia, payloadCambioCliente } from "../venta/dominio.ts";
import { altaLineaApi, articuloDeLinea } from "../venta/infraestructura.ts";
import {
  Albaran,
  DeleteLinea,
  GetAlbaran,
  GetAlbaranes,
  GetLineasAlbaran,
  GetReportAlbaran,
  LineaAlbaran,
  PatchArticuloLinea,
  PatchCambiarAgente,
  PatchCambiarDivisa,
  PatchCantidadLinea,
  PatchClienteAlbaran,
  PatchFacturarAlbaran,
  PatchLinea,
  PostAlbaran,
  PostLinea
} from "./diseño.ts";

const baseUrl = new ApiUrls().ALBARAN;

interface LineaAlbaranAPI extends Omit<LineaAlbaran, 'descripcionArticulo'> {
  descripcion_articulo: string | null;
}

interface AlbaranAPI {
  id: string;
  codigo: string;
  fecha: string;
  hora: string;
  almacen_id: string;
  nombre_almacen: string;
  de_abono: boolean;
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
  facturado: boolean;
}

export const albaranDesdeAPI = (p: AlbaranAPI): Albaran => ({
  ...p,
  fecha: new Date(Date.parse(p.fecha)),
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
});

export const lineaAlbaranFromAPI = (l: LineaAlbaranAPI): LineaAlbaran => ({
  ...l,
  descripcionArticulo: l.descripcion_articulo,
} as unknown as LineaAlbaran);

export const getAlbaran: GetAlbaran = async (id) => {
  return RestAPI.get<{ datos: AlbaranAPI }>(`${baseUrl}/${id}`).then((respuesta) => {
    return albaranDesdeAPI(respuesta.datos);
  });
};

export const getReportAlbaran: GetReportAlbaran = async (id) =>
  RestAPI.blob(`${baseUrl}/${id}/report`, "Error al obtener el report del albarán");

export const getAlbaranes: GetAlbaranes = async (
  filtro: Filtro,
  orden: Orden,
  paginacion: Paginacion
) => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: AlbaranAPI[]; total: number }>(baseUrl + q);
  return { datos: respuesta.datos.map(albaranDesdeAPI), total: respuesta.total };
};


export const postAlbaran: PostAlbaran = async (albaran) => {
  const payload = {
    cliente: payloadCambioCliente(albaran),
    empresa_id: empresaActual(),
  };
  return await RestAPI.post(baseUrl, payload, "Error al guardar albarán").then((respuesta) => respuesta.id);
};

export const getLineas: GetLineasAlbaran = async (id) =>
  await RestAPI.get<{ datos: LineaAlbaranAPI[] }>(
    `${baseUrl}/${id}/linea`).then((respuesta) => {
      const lineas = respuesta.datos.map((d) => lineaAlbaranFromAPI(d));
      return lineas
    });


export const postLinea: PostLinea = async (id, linea) => {
  return await RestAPI.post(`${baseUrl}/${id}/linea`, {
    lineas: [altaLineaApi(linea)]
  }, "Error al guardar").then((respuesta) => {
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}`, payload, "Error al actualizar la línea del albarán");
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar la línea del albarán");
}

export const patchCantidadLinea: PatchCantidadLinea = async (id, linea, cantidad) => {
  const payload = {
    cambios: {
      cantidad: cantidad,
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar la línea del albarán");
}

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/borrar`, {
    lineas: [lineaId]
  }, "Error al borrar la línea del albarán");
}

export const patchAlbaran = async (id: string, albaran: Albaran) => {
  const hora = normalizarHora(albaran.hora);

  const payload = {
    cambios: {
      agente_id: albaran.agente_id,
      divisa: {
        divisa_id: albaran.divisa_id,
        tasa_conversion: albaran.tasa_conversion,
      },
      fecha: albaran.fecha,
      ...(hora ? { hora } : {}),
      almacen_id: albaran.almacen_id,
      de_abono: esVerdadero(albaran.de_abono),
      cliente_id: albaran.cliente.cliente_id,
      nombre_cliente: albaran.cliente.nombre_cliente,
      id_fiscal: albaran.cliente.id_fiscal,
      direccion_id: albaran.cliente.direccion_id,
      forma_pago_id: albaran.forma_pago_id,
      grupo_iva_negocio_id: albaran.grupo_iva_negocio_id,
      por_comision: albaran.por_comision,
      observaciones: albaran.observaciones,
    },
  };

  await RestAPI.patch(`${baseUrl}/${id}`, payload,
    'Error al guardar el albarán'
  );
};

export const patchCambiarCliente: PatchClienteAlbaran = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: { cliente: payloadCambioCliente(cambio) }
  }, "Error al cambiar cliente del albarán");
};

export const borrarAlbaran = async (id: string) => {
  await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar albarán");
}

export const patchCambiarDescuento = async (id: string, dto_porcentual: number): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      por_descuento: dto_porcentual,
    }
  }, "Error al cambiar descuento del albarán");
};

export const patchCambiarDivisa: PatchCambiarDivisa = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      divisa: {
        divisa_id: cambio.divisa_id,
        tasa_conversion: cambio.tasa_conversion,
      }
    }
  }, "Error al cambiar divisa del albarán");
};

export const patchFacturarAlbaran: PatchFacturarAlbaran = async (id) => {
  const respuesta = (await RestAPI.patch(
    `${baseUrl}/${id}/facturar`,
    {},
    "Error al facturar el albarán"
  )) as unknown as
    | { datos: { factura_id: string; codigo?: string } }
    | { factura_id: string; codigo?: string };
  const datos = "datos" in respuesta ? respuesta.datos : respuesta;
  const facturaId = String(datos.factura_id ?? "");
  return { id: facturaId, codigo: String(datos.codigo ?? facturaId) };
};

export const patchCambiarAgente: PatchCambiarAgente = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      agente_id: cambio.agente_id,
      por_comision: cambio.por_comision,
    }
  }, "Error al cambiar agente del albarán");
};
