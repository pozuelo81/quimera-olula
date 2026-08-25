import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { MetricaCalidad, MetricaFacturacion, MetricaVentas } from "./diseño.ts";

type MetricaCalidadApi = {
    nombre_dataset: string;
    accuracy_porcentaje: number;
    mae: number;
    rmse: number;
    mape_porcentaje?: number;
    cobertura_intervalo_pct?: number;
    wape_porcentaje?: number;
    sesgo_unidades?: number;
};

const metricaDesdeApi = (m: MetricaCalidadApi, index: number): MetricaCalidad => {
    const base: MetricaCalidad = {
        id: String(index),
        nombreDataset: m.nombre_dataset,
        accuracyPorcentaje: m.accuracy_porcentaje,
        mae: m.mae,
        rmse: m.rmse,
    };

    if (m.mape_porcentaje !== undefined || m.cobertura_intervalo_pct !== undefined) {
        return {
            ...base,
            mapePorcentaje: m.mape_porcentaje ?? 0,
            coberturaIntervaloPct: m.cobertura_intervalo_pct ?? 0,
        } as MetricaFacturacion;
    }

    return {
        ...base,
        wapePorcentaje: m.wape_porcentaje ?? 0,
        sesgoUnidades: m.sesgo_unidades ?? 0,
    } as MetricaVentas;
};

export const obtenerMetricasCalidad = async (): Promise<MetricaCalidad[]> => {
    const respuesta = await RestAPI.get<{ datos: MetricaCalidadApi[] }>(
        `/predicciones/metricas_calidad`
    );
    return respuesta.datos.map(metricaDesdeApi);
};

export const obtenerMetricasCalidadPorDataset = async (nombreDataset: string): Promise<MetricaCalidad[]> => {
    const q = encodeURIComponent(`filtro[nombre_dataset]=${nombreDataset}`);
    const respuesta = await RestAPI.get<{ datos: MetricaCalidadApi[] }>(
        `/predicciones/metricas_calidad?q=${q}`
    );
    return respuesta.datos.map(metricaDesdeApi);
};
