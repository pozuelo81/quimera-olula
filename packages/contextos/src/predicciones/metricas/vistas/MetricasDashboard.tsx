
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { QTarjetaResumen } from "@olula/componentes/atomos/qtarjeta_resumen.tsx";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaDefecto, puede } from "@olula/lib/dominio.ts";
import { useEffect, useMemo, useState } from "react";
import "./metricas_dashboard.css";

interface Metricas {
    Accuracy_porcentaje?: number;
    WAPE_porcentaje?: number;
    MAPE_porcentaje?: number;
    MAE?: number;
    RMSE?: number;
    Sesgo_Unidades?: number;
    Cobertura_Intervalo_pct?: number;
    total_entidades_evaluadas?: number;
    total_referencias_evaluadas?: number;
    agrupacion?: string[];
}

interface MetricaData {
    nombre_dataset: string;
    frecuencia: string;
    fecha: string;
    fecha_calculo: string;
    metricas: Metricas;
}

interface MetricaEntidad {
    id: string;
    nombre_dataset: string;
    frecuencia: string;
    fecha: string;
    fecha_calculo: string;
    Accuracy_porcentaje?: number;
    WAPE_porcentaje?: number;
    MAPE_porcentaje?: number;
    MAE?: number;
    RMSE?: number;
    Sesgo_Unidades?: number;
    Cobertura_Intervalo_pct?: number;
    total_entidades_evaluadas?: number;
    total_referencias_evaluadas?: number;
    agrupacion?: string[];
    [key: string]: unknown;
}

interface MetricasResponse {
    datos: MetricaData[];
}

const REGLA = "predicciones.metricas.leer";
const safeFixed = (value: unknown, digits: number) => typeof value === "number" && isFinite(value) ? value.toFixed(digits) : "—";

const camposMetricas = [
    { key: "Accuracy_porcentaje", label: "Accuracy (%)", digits: 2 },
    { key: "WAPE_porcentaje", label: "WAPE (%)", digits: 2 },
    { key: "MAPE_porcentaje", label: "MAPE (%)", digits: 2 },
    { key: "MAE", label: "MAE", digits: 2 },
    { key: "RMSE", label: "RMSE", digits: 2 },
    { key: "Sesgo_Unidades", label: "Sesgo (Unidades)", digits: 2 },
    { key: "Cobertura_Intervalo_pct", label: "Cobertura Intervalo (%)", digits: 2 },
    { key: "total_entidades_evaluadas", label: "Total entidades", digits: 0 },
    { key: "total_referencias_evaluadas", label: "Total referencias", digits: 0 },
];

const tipos = [
    { key: "todos", label: "Todos" },
    { key: "facturacion", label: "Facturación" },
    { key: "ventas", label: "Ventas" },
];

function filtrarPorTipo(datos: MetricaData[], tipo: string): MetricaData[] {
    if (tipo === "todos") return datos;
    if (tipo === "facturacion") {
        return datos.filter((d) => d.nombre_dataset?.includes("facturacion"));
    }
    if (tipo === "ventas") {
        return datos.filter((d) => d.nombre_dataset?.includes("venta"));
    }
    return datos;
}


const metaTablaMetricas = [
    { id: "nombre_dataset", cabecera: "Dataset" },
    { id: "frecuencia", cabecera: "Frecuencia" },
    { id: "fecha", cabecera: "Fecha" },
    { id: "fecha_calculo", cabecera: "Fecha cálculo" },
    ...camposMetricas.map((campo) => {
        const tipo: "numero" | "texto" = campo.digits === 0 ? "numero" : "texto";
        return {
            id: campo.key,
            cabecera: campo.label,
            tipo,
            render: (e: MetricaEntidad) => safeFixed(e[campo.key as keyof MetricaEntidad], campo.digits),
        };
    }),
    {
        id: "agrupacion",
        cabecera: "Agrupación",
        render: (e: MetricaEntidad) => Array.isArray(e.agrupacion) ? e.agrupacion.join(", ") : "",
    },
];

function mapMetricasToEntidad(fila: MetricaData, i: number): MetricaEntidad {
    // Aplana los campos de metricas y añade id
    return {
        id: fila.nombre_dataset + "_" + i,
        nombre_dataset: fila.nombre_dataset,
        frecuencia: fila.frecuencia,
        fecha: fila.fecha,
        fecha_calculo: fila.fecha_calculo,
        ...(fila.metricas || {}),
        agrupacion: fila.metricas?.agrupacion,
    };
}

export const MetricasDashboard = () => {
    const [datos, setDatos] = useState<MetricaData[]>([]);
    const [cargando, setCargando] = useState(true);
    const [tipo, setTipo] = useState("todos");

    useEffect(() => {
        setCargando(true);
        RestAPI.get<MetricasResponse>(`/predicciones/metricas_calidad`).then((res) => {
            setDatos(res.datos || []);
            setCargando(false);
        });
    }, []);

    const datosFiltrados = useMemo(() => filtrarPorTipo(datos, tipo), [datos, tipo]);
    const entidades = useMemo(() => datosFiltrados.map(mapMetricasToEntidad), [datosFiltrados]);
    const [criteria, setCriteria] = useState(criteriaDefecto);

    // Tarjetas resumen: solo para el tipo filtrado
    const tarjetas = useMemo(() => {
        // Calcula medias solo de los campos principales
        if (!datosFiltrados.length) return [];
        let acc = 0, mae = 0, rmse = 0, n = 0;
        for (const d of datosFiltrados) {
            const m = d.metricas || {};
            if (typeof m.Accuracy_porcentaje === "number") acc += m.Accuracy_porcentaje;
            if (typeof m.MAE === "number") mae += m.MAE;
            if (typeof m.RMSE === "number") rmse += m.RMSE;
            n++;
        }
        return [
            {
                titulo: "Accuracy medio",
                valor: n ? `${(acc / n).toFixed(1)}%` : "—",
                icono: "check",
                comparacion: null,
            },
            {
                titulo: "MAE medio",
                valor: n ? (mae / n).toFixed(2) : "—",
                icono: "grafico_barras",
                comparacion: null,
            },
            {
                titulo: "RMSE medio",
                valor: n ? (rmse / n).toFixed(2) : "—",
                icono: "grafico_barras",
                comparacion: null,
            },
            {
                titulo: "Datasets",
                valor: String(n),
                icono: "tabla",
                comparacion: null,
            },
        ];
    }, [datosFiltrados]);

    if (!puede(REGLA)) {
        return (
            <div className="metricas-sin-acceso">
                <QIcono nombre="candado" tamaño="xl" color="var(--gris-5, #999)" />
                <h2>Acceso restringido</h2>
                <p>No tienes permisos para acceder a las métricas de predicciones.</p>
            </div>
        );
    }

    return (
        <div className="metricas-dashboard">
            <div className="metricas-cabecera">
                <h1>Métricas de Calidad de Predicciones</h1>
                <div className="metricas-filtro">
                    {tipos.map((t) => (
                        <QBoton
                            key={t.key}
                            variante={tipo === t.key ? "solido" : "borde"}
                            tamaño="pequeño"
                            onClick={() => setTipo(t.key)}
                        >
                            {t.label}
                        </QBoton>
                    ))}
                </div>
            </div>
            <div className="metricas-tarjetas">
                {tarjetas.map((t) => (
                    <QTarjetaResumen
                        key={t.titulo}
                        titulo={t.titulo}
                        valor={t.valor}
                        icono={t.icono}
                        comparacion={t.comparacion}
                    />
                ))}
            </div>
            {cargando ? (
                <div className="metricas-cargando">Cargando métricas...</div>
            ) : (
                <Listado
                    metaTabla={metaTablaMetricas}
                    entidades={entidades}
                    totalEntidades={entidades.length}
                    cargando={cargando}
                    criteria={criteria}
                    onCriteriaChanged={setCriteria}
                    seleccionada={undefined}
                    onSeleccion={() => {}}
                />
            )}
        </div>
    );
};
