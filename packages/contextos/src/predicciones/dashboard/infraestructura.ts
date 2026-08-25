import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { Filtro, Orden, Paginacion } from "@olula/lib/diseño.ts";
import { transformarCriteria } from "@olula/lib/dominio.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { PrediccionFacturacion, PrediccionVentasReferencia } from "./diseño.ts";

type PrediccionFacturacionApi = {
    fecha: string;
    prediccion: number;
    limite_inferior: number;
    limite_superior: number;
    facturacion_real: number | null;
    diferencia: number | null;
    desviacion_porcentaje: number | null;
    fecha_ejecucion: string;
};

const prediccionDesdeApi = (p: PrediccionFacturacionApi, index: number): PrediccionFacturacion => ({
    id: String(index),
    fecha: p.fecha,
    prediccion: p.prediccion,
    limiteInferior: p.limite_inferior,
    limiteSuperior: p.limite_superior,
    facturacionReal: p.facturacion_real,
    diferencia: p.diferencia,
    desviacionPorcentaje: p.desviacion_porcentaje,
    fechaEjecucion: p.fecha_ejecucion,
});

const obtenerPredicciones = async (url: string): Promise<PrediccionFacturacion[]> => {
    const respuesta = await RestAPI.get<{ datos: PrediccionFacturacionApi[]; total: number }>(url);
    return respuesta.datos.map(prediccionDesdeApi);
};

export const obtenerPrediccionesFacturacionMensual = () =>
    obtenerPredicciones(`/predicciones/facturacion_global_mensual`);

export const obtenerPrediccionesFacturacionSemanal = () =>
    obtenerPredicciones(`/predicciones/facturacion_global_semanal`);

// --- Ventas por referencia ---

type PrediccionVentasReferenciaApi = {
    referencia: string;
    subfamilia: string;
    familia: string;
    pvp: number;
    fecha: string;
    ventas_prediccion: number;
    ventas_real: number | null;
    diferencia: number | null;
    desviacion_porcentaje: number | null;
    fecha_ejecucion: string;
    stock_actual: number | null;
};

const ventasReferenciaDesdeApi = (p: PrediccionVentasReferenciaApi, index: number): PrediccionVentasReferencia => ({
    id: `${p.referencia}_${p.fecha}_${index}`,
    referencia: p.referencia,
    subfamilia: p.subfamilia,
    familia: p.familia,
    pvp: p.pvp,
    fecha: p.fecha,
    ventasPrediccion: p.ventas_prediccion,
    ventasReal: p.ventas_real,
    diferencia: p.diferencia,
    desviacionPorcentaje: p.desviacion_porcentaje,
    fechaEjecucion: p.fecha_ejecucion,
    stockActual: p.stock_actual,
});

const camposVentasRefToAPI: Record<string, string> = {
    ventasPrediccion: "ventas_prediccion",
    ventasReal: "ventas_real",
    desviacionPorcentaje: "desviacion_porcentaje",
    fechaEjecucion: "fecha_ejecucion",
    stockActual: "stock_actual",
};

export const obtenerVentasReferenciaSemanal = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion,
): Promise<{ datos: PrediccionVentasReferencia[]; total: number }> => {
    const criteria = transformarCriteria(camposVentasRefToAPI)({ filtro, orden, paginacion });
    const q = criteriaQuery(criteria.filtro, criteria.orden, criteria.paginacion);
    const respuesta = await RestAPI.get<{ datos: PrediccionVentasReferenciaApi[]; total: number }>(
        `/predicciones/ventas_ref_pvp_semanal${q}`
    );
    return {
        datos: respuesta.datos.map(ventasReferenciaDesdeApi),
        total: respuesta.total,
    };
};

export const obtenerVentasReferencia = async (
    filtro: Filtro,
    orden: Orden,
    paginacion: Paginacion,
): Promise<{ datos: PrediccionVentasReferencia[]; total: number }> => {
    const criteria = transformarCriteria(camposVentasRefToAPI)({ filtro, orden, paginacion });
    const q = criteriaQuery(criteria.filtro, criteria.orden, criteria.paginacion);
    const respuesta = await RestAPI.get<{ datos: PrediccionVentasReferenciaApi[]; total: number }>(
        `/predicciones/ventas_ref_pvp_mensual${q}`
    );
    return {
        datos: respuesta.datos.map(ventasReferenciaDesdeApi),
        total: respuesta.total,
    };
};
