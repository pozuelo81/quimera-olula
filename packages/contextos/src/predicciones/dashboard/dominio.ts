import { formatearMoneda } from "@olula/lib/dominio.ts";
import { PrediccionFacturacion, PrediccionVentasSubfamilia, PrediccionVentasReferencia } from "./diseño.ts";

export type PuntoGrafico = {
    etiqueta: string;
    [clave: string]: number | string | null | undefined;
};

export type SerieInfo = {
    año: string;
    tieneReal: boolean;
    tienePrediccion: boolean;
    color: string;
};

export type Tarjeta = {
    titulo: string;
    valor: string;
    icono: string;
    comparacion: { valor: string; positivo: boolean } | null;
};

export const NOMBRES_MES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
export const PALETA = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe", "#00C49F", "#ff6b6b"];
export const COLOR_SEMANAL_REAL = "#8884d8";
export const COLOR_SEMANAL_PRED = "#8884d8";

export const formatearFechaCorta = (fecha: Date): string => {
    const dia = fecha.getDate();
    return `${dia} ${NOMBRES_MES[fecha.getMonth()]}`;
};

export const transformarDatosMensual = (datos: PrediccionFacturacion[]) => {
    const seriesPorAño: Record<string, { tieneReal: boolean; tienePrediccion: boolean; ultimoIdxReal: number }> = {};
    const porMes: Record<number, PuntoGrafico> = {};

    for (const d of datos) {
        const fecha = new Date(d.fecha);
        const mesIdx = fecha.getMonth();
        const año = String(fecha.getFullYear());

        if (!seriesPorAño[año]) {
            seriesPorAño[año] = { tieneReal: false, tienePrediccion: false, ultimoIdxReal: -1 };
        }

        if (!porMes[mesIdx]) {
            porMes[mesIdx] = { etiqueta: NOMBRES_MES[mesIdx] };
        }

        const esPrediccion = d.facturacionReal === null;

        if (esPrediccion) {
            seriesPorAño[año].tienePrediccion = true;
            porMes[mesIdx][`pred_${año}`] = d.prediccion;
            porMes[mesIdx][`limSup_${año}`] = d.limiteSuperior;
            porMes[mesIdx][`limInf_${año}`] = d.limiteInferior;
        } else {
            seriesPorAño[año].tieneReal = true;
            if (mesIdx > seriesPorAño[año].ultimoIdxReal) {
                seriesPorAño[año].ultimoIdxReal = mesIdx;
            }
            porMes[mesIdx][`real_${año}`] = d.facturacionReal;
        }
    }

    for (const [año, info] of Object.entries(seriesPorAño)) {
        if (info.tieneReal && info.tienePrediccion && info.ultimoIdxReal >= 0) {
            if (porMes[info.ultimoIdxReal]) {
                porMes[info.ultimoIdxReal][`pred_${año}`] = porMes[info.ultimoIdxReal][`real_${año}`];
            }
        }
    }

    const añosOrdenados = Object.keys(seriesPorAño).sort();
    const series: SerieInfo[] = añosOrdenados.map((año, i) => ({
        año,
        tieneReal: seriesPorAño[año].tieneReal,
        tienePrediccion: seriesPorAño[año].tienePrediccion,
        color: PALETA[i % PALETA.length],
    }));

    const datosGrafico: PuntoGrafico[] = [];
    for (let i = 0; i <= 11; i++) {
        if (porMes[i]) datosGrafico.push(porMes[i]);
    }

    return { datosGrafico, series };
};

const filtrarVentanaSemanal = (datos: PrediccionFacturacion[]): PrediccionFacturacion[] => {
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 3, 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 4, 0);

    return datos.filter((d) => {
        const fecha = new Date(d.fecha);
        return fecha >= inicio && fecha <= fin;
    });
};

export const transformarDatosSemanal = (datos: PrediccionFacturacion[]) => {
    const datosFiltrados = filtrarVentanaSemanal(datos);

    const datosOrdenados = [...datosFiltrados].sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    let ultimoRealIdx = -1;
    const datosGrafico: PuntoGrafico[] = datosOrdenados.map((d, i) => {
        const fecha = new Date(d.fecha);
        const esPrediccion = d.facturacionReal === null;
        const punto: PuntoGrafico = { etiqueta: formatearFechaCorta(fecha) };

        if (esPrediccion) {
            punto.prediccion = d.prediccion;
            punto.limSup = d.limiteSuperior;
            punto.limInf = d.limiteInferior;
        } else {
            punto.real = d.facturacionReal;
            ultimoRealIdx = i;
        }

        return punto;
    });

    if (ultimoRealIdx >= 0 && ultimoRealIdx < datosGrafico.length - 1) {
        datosGrafico[ultimoRealIdx].prediccion = datosGrafico[ultimoRealIdx].real;
    }

    const tieneReal = datosOrdenados.some((d) => d.facturacionReal !== null);
    const tienePrediccion = datosOrdenados.some((d) => d.facturacionReal === null);

    return { datosGrafico, tieneReal, tienePrediccion };
};

export const agruparPorSubfamilia = (datos: PrediccionVentasReferencia[]): PrediccionVentasSubfamilia[] => {
    const porSubfamilia: Record<string, number> = {};

    for (const d of datos) {
        porSubfamilia[d.subfamilia] = (porSubfamilia[d.subfamilia] ?? 0) + d.ventasPrediccion;
    }

    return Object.entries(porSubfamilia).map(([subfamilia, ventasPrediccion]) => ({
        id: subfamilia,
        subfamilia,
        ventasPrediccion,
    }));
};

export const calcularTarjetas = (
    datosMensual: PrediccionFacturacion[],
    datosSemanal: PrediccionFacturacion[],
): Tarjeta[] => {
    if (datosMensual.length === 0) return [];

    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    const mesActual = hoy.getMonth();

    const semanasOrdenadas = [...datosSemanal].sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
    const semanaActual = semanasOrdenadas.find((d) => {
        const f = new Date(d.fecha);
        return f >= hoy || (f.getTime() > hoy.getTime() - 7 * 86400000);
    });
    const idxSemanaActual = semanaActual ? semanasOrdenadas.indexOf(semanaActual) : -1;
    const semanaAnterior = idxSemanaActual > 0 ? semanasOrdenadas[idxSemanaActual - 1] : null;

    const valorSemanal = semanaActual
        ? semanaActual.facturacionReal ?? semanaActual.prediccion
        : 0;
    const valorSemanaAnterior = semanaAnterior
        ? semanaAnterior.facturacionReal ?? semanaAnterior.prediccion
        : 0;
    const diffSemanal = valorSemanaAnterior > 0
        ? ((valorSemanal - valorSemanaAnterior) / valorSemanaAnterior) * 100
        : 0;

    const mesActualData = datosMensual.find((d) => {
        const f = new Date(d.fecha);
        return f.getFullYear() === añoActual && f.getMonth() === mesActual;
    });
    const mesAnteriorData = datosMensual.find((d) => {
        const f = new Date(d.fecha);
        const mesAnteriorIdx = mesActual === 0 ? 11 : mesActual - 1;
        const añoMesAnterior = mesActual === 0 ? añoActual - 1 : añoActual;
        return f.getFullYear() === añoMesAnterior && f.getMonth() === mesAnteriorIdx;
    });

    const valorMensual = mesActualData
        ? mesActualData.facturacionReal ?? mesActualData.prediccion
        : 0;
    const valorMesAnterior = mesAnteriorData
        ? mesAnteriorData.facturacionReal ?? mesAnteriorData.prediccion
        : 0;
    const diffMensual = valorMesAnterior > 0
        ? ((valorMensual - valorMesAnterior) / valorMesAnterior) * 100
        : 0;

    const datosAñoActual = datosMensual.filter((d) => new Date(d.fecha).getFullYear() === añoActual);
    const cierreAño = datosAñoActual.reduce((acc, d) => {
        return acc + (d.facturacionReal ?? d.prediccion);
    }, 0);

    const datosAñoAnterior = datosMensual.filter((d) => new Date(d.fecha).getFullYear() === añoActual - 1);
    const totalAñoAnterior = datosAñoAnterior.reduce((acc, d) => {
        return acc + (d.facturacionReal ?? d.prediccion);
    }, 0);
    const diffAnual = totalAñoAnterior > 0
        ? ((cierreAño - totalAñoAnterior) / totalAñoAnterior) * 100
        : 0;

    return [
        {
            titulo: "Previsión semanal",
            valor: formatearMoneda(valorSemanal, "EUR"),
            icono: "calendario_vacio",
            comparacion: valorSemanaAnterior > 0
                ? { valor: `${diffSemanal >= 0 ? "+" : ""}${diffSemanal.toFixed(1)}% vs semana anterior`, positivo: diffSemanal >= 0 }
                : null,
        },
        {
            titulo: "Previsión mensual",
            valor: formatearMoneda(valorMensual, "EUR"),
            icono: "grafico_barras",
            comparacion: valorMesAnterior > 0
                ? { valor: `${diffMensual >= 0 ? "+" : ""}${diffMensual.toFixed(1)}% vs mes anterior`, positivo: diffMensual >= 0 }
                : null,
        },
        {
            titulo: `Previsión cierre ${añoActual}`,
            valor: formatearMoneda(cierreAño, "EUR"),
            icono: "carrito",
            comparacion: totalAñoAnterior > 0
                ? { valor: `${diffAnual >= 0 ? "+" : ""}${diffAnual.toFixed(1)}% vs ${añoActual - 1}`, positivo: diffAnual >= 0 }
                : null,
        },
    ];
};
