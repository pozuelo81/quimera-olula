import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { AnalisisStock, ResumenStockSubfamilia } from "../diseño.ts";
import { COLORES_ESTADO } from "../dominio.ts";

type GraficoRiesgoStockProps = {
    datos: AnalisisStock[];
};

export const GraficoRiesgoStock = ({ datos }: GraficoRiesgoStockProps) => {
    const datosOrdenados = [...datos]
        .filter((d) => d.coberturaSemanas < 999)
        .sort((a, b) => a.coberturaSemanas - b.coberturaSemanas)
        .slice(0, 15);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datosOrdenados} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    tickFormatter={(v: number) => `${v} sem.`}
                />
                <YAxis
                    type="category"
                    dataKey="referencia"
                    width={80}
                    tick={{ fontSize: 11 }}
                />
                <Tooltip
                    formatter={(valor) => [
                        `${Number(valor)} semanas`,
                        "Cobertura",
                    ]}
                />
                <Bar dataKey="coberturaSemanas" name="Cobertura" radius={[0, 4, 4, 0]}>
                    {datosOrdenados.map((entry) => (
                        <Cell key={entry.id} fill={COLORES_ESTADO[entry.estado]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

type GraficoCoberturaSubfamiliaProps = {
    datos: ResumenStockSubfamilia[];
};

export const GraficoCoberturaSubfamilia = ({ datos }: GraficoCoberturaSubfamiliaProps) => {
    const datosOrdenados = [...datos]
        .sort((a, b) => a.coberturaMedia - b.coberturaMedia)
        .slice(0, 10);

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
                <YAxis tickFormatter={(v: number) => `${v} sem.`} />
                <Tooltip
                    formatter={(valor) => [`${Number(valor)} semanas`, "Cobertura media"]}
                />
                <Bar dataKey="coberturaMedia" name="Cobertura media" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};
