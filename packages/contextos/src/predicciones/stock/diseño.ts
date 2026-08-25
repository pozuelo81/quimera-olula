import { Entidad } from "@olula/lib/diseño.ts";

export type EstadoStock = "critico" | "bajo" | "normal" | "exceso";

export interface AnalisisStock extends Entidad {
    id: string;
    referencia: string;
    subfamilia: string;
    familia: string;
    pvp: number;
    stockActual: number;
    ventasPrediccionSemanal: number;
    ventasPrediccionMensual: number;
    coberturaSemanas: number;
    coberturaMeses: number;
    estado: EstadoStock;
}

export interface ResumenStockSubfamilia extends Entidad {
    id: string;
    subfamilia: string;
    stockTotal: number;
    ventasPrediccionTotal: number;
    coberturaMedia: number;
}

export type TarjetaStock = {
    titulo: string;
    valor: string;
    icono: string;
    comparacion: { valor: string; positivo: boolean } | null;
};
