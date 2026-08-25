import { Entidad } from "@olula/lib/diseño.ts";

export interface MetricaCalidad extends Entidad {
    id: string;
    nombreDataset: string;
    accuracyPorcentaje: number;
    mae: number;
    rmse: number;
}

export interface MetricaFacturacion extends MetricaCalidad {
    mapePorcentaje: number;
    coberturaIntervaloPct: number;
}

export interface MetricaVentas extends MetricaCalidad {
    wapePorcentaje: number;
    sesgoUnidades: number;
}

export type MetricaUnificada = MetricaFacturacion | MetricaVentas;

export type EstadoMetrica = "bueno" | "aceptable" | "malo";

export type TipoDataset = "todos" | "facturacion" | "ventas";
