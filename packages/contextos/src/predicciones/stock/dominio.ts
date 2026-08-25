import { PrediccionVentasReferencia } from "../dashboard/diseño.ts";
import { AnalisisStock, EstadoStock, ResumenStockSubfamilia, TarjetaStock } from "./diseño.ts";

const calcularEstado = (coberturaSemanas: number): EstadoStock => {
    if (coberturaSemanas < 2) return "critico";
    if (coberturaSemanas < 4) return "bajo";
    if (coberturaSemanas <= 12) return "normal";
    return "exceso";
};

export const crearAnalisisStock = (
    datosSemanales: PrediccionVentasReferencia[],
    datosMensuales: PrediccionVentasReferencia[],
): AnalisisStock[] => {
    const mensualesPorRef = new Map<string, PrediccionVentasReferencia>();
    for (const d of datosMensuales) {
        if (d.stockActual !== null && d.stockActual > 0) {
            const existente = mensualesPorRef.get(d.referencia);
            if (!existente || new Date(d.fecha) > new Date(existente.fecha)) {
                mensualesPorRef.set(d.referencia, d);
            }
        }
    }

    const semanalesPorRef = new Map<string, PrediccionVentasReferencia>();
    for (const d of datosSemanales) {
        if (d.stockActual !== null && d.stockActual > 0) {
            const existente = semanalesPorRef.get(d.referencia);
            if (!existente || new Date(d.fecha) > new Date(existente.fecha)) {
                semanalesPorRef.set(d.referencia, d);
            }
        }
    }

    const referencias = new Set([...semanalesPorRef.keys(), ...mensualesPorRef.keys()]);
    const resultado: AnalisisStock[] = [];

    for (const ref of referencias) {
        const semanal = semanalesPorRef.get(ref);
        const mensual = mensualesPorRef.get(ref);
        const base = semanal ?? mensual;
        if (!base) continue;

        const stockActual = base.stockActual ?? 0;
        const ventasSemanal = semanal?.ventasPrediccion ?? 0;
        const ventasMensual = mensual?.ventasPrediccion ?? 0;

        const coberturaSemanas = ventasSemanal > 0 ? stockActual / ventasSemanal : stockActual > 0 ? 999 : 0;
        const coberturaMeses = ventasMensual > 0 ? stockActual / ventasMensual : stockActual > 0 ? 999 : 0;

        resultado.push({
            id: ref,
            referencia: ref,
            subfamilia: base.subfamilia,
            familia: base.familia,
            pvp: base.pvp,
            stockActual,
            ventasPrediccionSemanal: ventasSemanal,
            ventasPrediccionMensual: ventasMensual,
            coberturaSemanas: Math.round(coberturaSemanas * 10) / 10,
            coberturaMeses: Math.round(coberturaMeses * 10) / 10,
            estado: calcularEstado(coberturaSemanas),
        });
    }

    return resultado.sort((a, b) => a.coberturaSemanas - b.coberturaSemanas);
};

export const agruparStockPorSubfamilia = (analisis: AnalisisStock[]): ResumenStockSubfamilia[] => {
    const porSubfamilia: Record<string, { stockTotal: number; ventasTotal: number; coberturas: number[]; }> = {};

    for (const a of analisis) {
        if (!porSubfamilia[a.subfamilia]) {
            porSubfamilia[a.subfamilia] = { stockTotal: 0, ventasTotal: 0, coberturas: [] };
        }
        porSubfamilia[a.subfamilia].stockTotal += a.stockActual;
        porSubfamilia[a.subfamilia].ventasTotal += a.ventasPrediccionSemanal;
        porSubfamilia[a.subfamilia].coberturas.push(a.coberturaSemanas);
    }

    return Object.entries(porSubfamilia).map(([subfamilia, datos]) => {
        const coberturaMedia = datos.coberturas.length > 0
            ? datos.coberturas.reduce((a, b) => a + b, 0) / datos.coberturas.length
            : 0;
        return {
            id: subfamilia,
            subfamilia,
            stockTotal: datos.stockTotal,
            ventasPrediccionTotal: datos.ventasTotal,
            coberturaMedia: Math.round(coberturaMedia * 10) / 10,
        };
    });
};

export const COLORES_ESTADO: Record<EstadoStock, string> = {
    critico: "#ef4444",
    bajo: "#f59e0b",
    normal: "#22c55e",
    exceso: "#3b82f6",
};

export const ETIQUETAS_ESTADO: Record<EstadoStock, string> = {
    critico: "Crítico",
    bajo: "Bajo",
    normal: "Normal",
    exceso: "Exceso",
};

export const calcularTarjetasStock = (analisis: AnalisisStock[]): TarjetaStock[] => {
    if (analisis.length === 0) return [];

    const total = analisis.length;
    const coberturaMedia = analisis.reduce((acc, a) => acc + a.coberturaSemanas, 0) / total;
    const enRiesgo = analisis.filter((a) => a.estado === "critico" || a.estado === "bajo").length;
    const exceso = analisis.filter((a) => a.estado === "exceso").length;

    return [
        {
            titulo: "Referencias analizadas",
            valor: total.toLocaleString(),
            icono: "almacen",
            comparacion: null,
        },
        {
            titulo: "Cobertura media",
            valor: `${Math.round(coberturaMedia * 10) / 10} sem.`,
            icono: "calendario_vacio",
            comparacion: null,
        },
        {
            titulo: "En riesgo",
            valor: enRiesgo.toLocaleString(),
            icono: "alerta",
            comparacion: total > 0
                ? { valor: `${((enRiesgo / total) * 100).toFixed(1)}% del total`, positivo: false }
                : null,
        },
        {
            titulo: "Exceso de stock",
            valor: exceso.toLocaleString(),
            icono: "carrito",
            comparacion: total > 0
                ? { valor: `${((exceso / total) * 100).toFixed(1)}% del total`, positivo: true }
                : null,
        },
    ];
};
