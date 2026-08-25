import { formatearMoneda } from "@olula/lib/dominio.ts";
import {
    Area,
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { PrediccionFacturacion, PrediccionVentasSubfamilia } from "../diseño.ts";
import {
    COLOR_SEMANAL_PRED,
    COLOR_SEMANAL_REAL,
    transformarDatosMensual,
    transformarDatosSemanal,
} from "../dominio.ts";

type GraficoMensualProps = {
    datos: PrediccionFacturacion[];
};

export const GraficoMensual = ({ datos }: GraficoMensualProps) => {
    const { datosGrafico, series } = transformarDatosMensual(datos);
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="etiqueta" />
                <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(valor) => formatearMoneda(Number(valor), "EUR")} />
                <Legend />

                {series.filter((s) => s.tienePrediccion).map((s) => (
                    <Area
                        key={`limSup_${s.año}`}
                        type="monotone"
                        dataKey={`limSup_${s.año}`}
                        fill={s.color}
                        fillOpacity={0.1}
                        stroke="none"
                        legendType="none"
                        tooltipType="none"
                    />
                ))}
                {series.filter((s) => s.tienePrediccion).map((s) => (
                    <Area
                        key={`limInf_${s.año}`}
                        type="monotone"
                        dataKey={`limInf_${s.año}`}
                        fill="#ffffff"
                        fillOpacity={1}
                        stroke="none"
                        legendType="none"
                        tooltipType="none"
                    />
                ))}
                {series.filter((s) => s.tieneReal).map((s) => (
                    <Line
                        key={`real_${s.año}`}
                        type="monotone"
                        dataKey={`real_${s.año}`}
                        name={`Real ${s.año}`}
                        stroke={s.color}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls={false}
                    />
                ))}
                {series.filter((s) => s.tienePrediccion).map((s) => (
                    <Line
                        key={`pred_${s.año}`}
                        type="monotone"
                        dataKey={`pred_${s.año}`}
                        name={`Predicción ${s.año}`}
                        stroke={s.color}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 3 }}
                        connectNulls={false}
                    />
                ))}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

type GraficoSemanalProps = {
    datos: PrediccionFacturacion[];
};

export const GraficoSemanal = ({ datos }: GraficoSemanalProps) => {
    const { datosGrafico, tieneReal, tienePrediccion } = transformarDatosSemanal(datos);
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="etiqueta" interval={3} />
                <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(valor) => formatearMoneda(Number(valor), "EUR")} />
                <Legend />

                {tienePrediccion && (
                    <Area
                        type="monotone"
                        dataKey="limSup"
                        fill={COLOR_SEMANAL_PRED}
                        fillOpacity={0.1}
                        stroke="none"
                        legendType="none"
                        tooltipType="none"
                    />
                )}
                {tienePrediccion && (
                    <Area
                        type="monotone"
                        dataKey="limInf"
                        fill="#ffffff"
                        fillOpacity={1}
                        stroke="none"
                        legendType="none"
                        tooltipType="none"
                    />
                )}
                {tieneReal && (
                    <Line
                        type="monotone"
                        dataKey="real"
                        name="Real"
                        stroke={COLOR_SEMANAL_REAL}
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        connectNulls={false}
                    />
                )}
                {tienePrediccion && (
                    <Line
                        type="monotone"
                        dataKey="prediccion"
                        name="Predicción"
                        stroke={COLOR_SEMANAL_PRED}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 2 }}
                        connectNulls={false}
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

type GraficoSubfamiliaProps = {
    datos: PrediccionVentasSubfamilia[];
};

export const GraficoSubfamilia = ({ datos }: GraficoSubfamiliaProps) => {
    const datosOrdenados = [...datos].sort((a, b) => b.ventasPrediccion - a.ventasPrediccion).slice(0, 10);
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datosOrdenados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="subfamilia"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 11 }}
                />
                <YAxis tickFormatter={(v: number) => v.toLocaleString()} />
                <Tooltip formatter={(valor) => Math.round(Number(valor)).toLocaleString()} />
                <Bar dataKey="ventasPrediccion" name="Predicción" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};
