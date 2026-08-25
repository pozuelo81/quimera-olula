import { EstadoMetrica, MetricaCalidad, MetricaFacturacion, MetricaVentas } from "./diseño.ts";

export type Tarjeta = {
    titulo: string;
    valor: string;
    icono: string;
    comparacion: { valor: string; positivo: boolean } | null;
};

export const esMetricaFacturacion = (m: MetricaCalidad): m is MetricaFacturacion =>
    "mapePorcentaje" in m;

export const esMetricaVentas = (m: MetricaCalidad): m is MetricaVentas =>
    "wapePorcentaje" in m;

export const evaluarAccuracy = (valor: number, esFacturacion: boolean): EstadoMetrica => {
    const umbralBueno = esFacturacion ? 80 : 70;
    const umbralAceptable = esFacturacion ? 60 : 50;
    if (valor >= umbralBueno) return "bueno";
    if (valor >= umbralAceptable) return "aceptable";
    return "malo";
};

export const evaluarMAPE = (valor: number): EstadoMetrica => {
    if (valor <= 20) return "bueno";
    if (valor <= 35) return "aceptable";
    return "malo";
};

export const evaluarWAPE = (valor: number): EstadoMetrica => {
    if (valor <= 30) return "bueno";
    if (valor <= 50) return "aceptable";
    return "malo";
};

export const evaluarCobertura = (valor: number): EstadoMetrica => {
    if (valor >= 80) return "bueno";
    if (valor >= 60) return "aceptable";
    return "malo";
};

export const evaluarSesgo = (valor: number): EstadoMetrica => {
    const abs = Math.abs(valor);
    if (abs <= 5) return "bueno";
    if (abs <= 15) return "aceptable";
    return "malo";
};

export const COLORES_ESTADO: Record<EstadoMetrica, string> = {
    bueno: "var(--verde-7, #2e7d32)",
    aceptable: "var(--amarillo-7, #f57f17)",
    malo: "var(--rojo-7, #c62828)",
};

export const ETIQUETAS_ESTADO: Record<EstadoMetrica, string> = {
    bueno: "Bueno",
    aceptable: "Aceptable",
    malo: "Malo",
};

export const calcularTarjetas = (metricas: MetricaCalidad[]): Tarjeta[] => {
    if (metricas.length === 0) return [];

    const accuracyMedia = metricas.reduce((sum, m) => sum + m.accuracyPorcentaje, 0) / metricas.length;
    const maeMedia = metricas.reduce((sum, m) => sum + m.mae, 0) / metricas.length;
    const rmseMedia = metricas.reduce((sum, m) => sum + m.rmse, 0) / metricas.length;

    const estadoAccuracy = evaluarAccuracy(accuracyMedia, true);

    return [
        {
            titulo: "Accuracy Media",
            valor: `${accuracyMedia.toFixed(1)}%`,
            icono: "check",
            comparacion: {
                valor: ETIQUETAS_ESTADO[estadoAccuracy],
                positivo: estadoAccuracy === "bueno",
            },
        },
        {
            titulo: "MAE Medio",
            valor: maeMedia.toFixed(2),
            icono: "grafico_barras",
            comparacion: null,
        },
        {
            titulo: "RMSE Medio",
            valor: rmseMedia.toFixed(2),
            icono: "grafico_barras",
            comparacion: null,
        },
        {
            titulo: "Datasets",
            valor: String(metricas.length),
            icono: "tabla",
            comparacion: null,
        },
    ];
};
