import { Entidad } from "@olula/lib/diseño.ts";

export interface PrediccionFacturacion extends Entidad {
    id: string;
    fecha: string;
    prediccion: number;
    limiteInferior: number;
    limiteSuperior: number;
    facturacionReal: number | null;
    diferencia: number | null;
    desviacionPorcentaje: number | null;
    fechaEjecucion: string;
}

export type PeriodoPrediccion = "mensual" | "semanal";

export interface PrediccionVentasReferencia extends Entidad {
    id: string;
    referencia: string;
    subfamilia: string;
    familia: string;
    pvp: number;
    fecha: string;
    ventasPrediccion: number;
    ventasReal: number | null;
    diferencia: number | null;
    desviacionPorcentaje: number | null;
    fechaEjecucion: string;
    stockActual: number | null;
}

export interface PrediccionVentasSubfamilia extends Entidad {
    id: string;
    subfamilia: string;
    ventasPrediccion: number;
}
