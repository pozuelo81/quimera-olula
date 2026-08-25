import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { QTarjetaResumen } from "@olula/componentes/atomos/qtarjeta_resumen.tsx";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AnalisisStock, EstadoStock } from "../diseño.ts";
import {
    agruparStockPorSubfamilia,
    calcularTarjetasStock,
    crearAnalisisStock,
    ETIQUETAS_ESTADO,
} from "../dominio.ts";
import {
    obtenerVentasReferencia,
    obtenerVentasReferenciaSemanal,
} from "../infraestructura.ts";
import { GraficoCoberturaSubfamilia, GraficoRiesgoStock } from "./graficos_stock.tsx";
import "./stock_dashboard.css";

type AccionStock = {
    texto: string;
    icono: string;
    onClick: (e: AnalisisStock) => void;
    variante?: "solido" | "borde" | "texto";
};

const accionesPorEstado = (
    estado: EstadoStock,
    navigate: (url: string) => void,
): AccionStock[] => {
    const acciones: AccionStock[] = [
        {
            texto: "Ver stock",
            icono: "ver",
            onClick: () => navigate("/almacen/transferencias"),
            variante: "texto",
        },
    ];

    if (estado === "critico" || estado === "bajo") {
        acciones.unshift({
            texto: "Pedir stock",
            icono: "carrito",
            onClick: () => navigate("/ventas/pedido"),
            variante: "borde",
        });
    }

    if (estado === "exceso") {
        acciones.unshift({
            texto: "Crear promoción",
            icono: "crear",
            onClick: () => navigate("/ventas/presupuesto"),
            variante: "borde",
        });
    }

    if (estado === "normal") {
        acciones.unshift({
            texto: "Nuevo pedido",
            icono: "añadir",
            onClick: () => navigate("/ventas/pedido"),
            variante: "texto",
        });
    }

    return acciones;
};

const crearMetaTablaStock = (navigate: (url: string) => void): MetaTabla<AnalisisStock> => [
    { id: "referencia", cabecera: "Referencia" },
    { id: "subfamilia", cabecera: "Subfamilia" },
    { id: "familia", cabecera: "Familia" },
    {
        id: "stockActual",
        cabecera: "Stock",
        tipo: "numero",
        render: (e) => Math.round(e.stockActual ?? 0).toLocaleString(),
    },
    {
        id: "ventasPrediccionSemanal",
        cabecera: "Pred. semanal",
        tipo: "numero",
        render: (e) => Math.round(e.ventasPrediccionSemanal ?? 0).toLocaleString(),
    },
    {
        id: "coberturaSemanas",
        cabecera: "Cobertura (sem.)",
        tipo: "numero",
        render: (e) => (e.coberturaSemanas ?? 0) >= 999 ? "Sin venta" : (e.coberturaSemanas ?? 0).toFixed(1),
    },
    {
        id: "estado",
        cabecera: "Estado",
        render: (e) => (
            <span className={`stock-estado stock-estado--${e.estado}`}>
                {ETIQUETAS_ESTADO[e.estado]}
            </span>
        ),
    },
    {
        id: "id",
        cabecera: "Acciones",
        ancho: "220px",
        render: (e) => (
            <div className="stock-acciones" onClick={(ev) => ev.stopPropagation()}>
                {accionesPorEstado(e.estado, navigate).map((accion) => (
                    <QBoton
                        key={accion.texto}
                        variante={accion.variante ?? "texto"}
                        tamaño="pequeño"
                        onClick={() => accion.onClick(e)}
                    >
                        <QIcono nombre={accion.icono} tamaño="xs" />
                        {" "}{accion.texto}
                    </QBoton>
                ))}
            </div>
        ),
    },
];

const criteriaInicial: Criteria = {
    ...criteriaDefecto,
    orden: ["coberturaSemanas", "ASC"],
    paginacion: { pagina: 1, limite: 25 },
};

const aplicarCriteria = (datos: AnalisisStock[], criteria: Criteria): { datos: AnalisisStock[]; total: number } => {
    let resultado = [...datos];

    for (const f of criteria.filtro as ClausulaFiltro[]) {
        const [campo, , valor] = f;
        if (campo && valor) {
            const valorStr = String(valor).toLowerCase();
            resultado = resultado.filter((d) => {
                const v = d[campo as keyof AnalisisStock];
                return String(v).toLowerCase().includes(valorStr);
            });
        }
    }

    const [campoOrden, direccion] = criteria.orden;
    if (campoOrden) {
        resultado.sort((a, b) => {
            const va = a[campoOrden as keyof AnalisisStock];
            const vb = b[campoOrden as keyof AnalisisStock];
            if (typeof va === "number" && typeof vb === "number") {
                return direccion === "ASC" ? va - vb : vb - va;
            }
            return direccion === "ASC"
                ? String(va).localeCompare(String(vb))
                : String(vb).localeCompare(String(va));
        });
    }

    const total = resultado.length;
    const { pagina, limite } = criteria.paginacion;
    const inicio = (pagina - 1) * limite;
    resultado = resultado.slice(inicio, inicio + limite);

    return { datos: resultado, total };
};

export const StockDashboard = () => {
    const navigate = useNavigate();
    const [analisis, setAnalisis] = useState<AnalisisStock[]>([]);
    const [cargando, setCargando] = useState(true);
    const [criteria, setCriteria] = useState<Criteria>(criteriaInicial);

    const metaTablaStock = useMemo(() => crearMetaTablaStock(navigate), [navigate]);

    useEffect(() => {
        const cargar = async () => {
            const [semanales, mensuales] = await Promise.all([
                obtenerVentasReferenciaSemanal([], ["referencia", "ASC"], { pagina: 1, limite: 10000 }),
                obtenerVentasReferencia([], ["referencia", "ASC"], { pagina: 1, limite: 10000 }),
            ]);
            setAnalisis(crearAnalisisStock(semanales.datos, mensuales.datos));
            setCargando(false);
        };
        cargar();
    }, []);

    const handleCriteriaChanged = useCallback((nuevaCriteria: Criteria) => {
        setCriteria(nuevaCriteria);
    }, []);

    const { datos: datosPaginados, total } = useMemo(
        () => aplicarCriteria(analisis, criteria),
        [analisis, criteria],
    );

    const tarjetas = cargando ? [] : calcularTarjetasStock(analisis);
    const resumenSubfamilia = useMemo(() => agruparStockPorSubfamilia(analisis), [analisis]);

    return (
        <div className="stock-dashboard">
            <h1>Análisis de Stock vs Predicciones</h1>

            <div className="stock-dashboard-tarjetas">
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

            <div className="stock-dashboard-fila">
                <div className="stock-dashboard-seccion stock-dashboard-fila-principal">
                    <h2>Referencias con menor cobertura</h2>
                    <div className="stock-dashboard-grafico">
                        {cargando ? (
                            <div className="stock-dashboard-grafico-cargando">Cargando datos...</div>
                        ) : (
                            <GraficoRiesgoStock datos={analisis} />
                        )}
                    </div>
                </div>

                <div className="stock-dashboard-seccion stock-dashboard-fila-secundaria">
                    <h2>Cobertura media por subfamilia</h2>
                    <div className="stock-dashboard-grafico">
                        {cargando ? (
                            <div className="stock-dashboard-grafico-cargando">Cargando datos...</div>
                        ) : (
                            <GraficoCoberturaSubfamilia datos={resumenSubfamilia} />
                        )}
                    </div>
                </div>
            </div>

            <div className="stock-dashboard-seccion">
                <h2>Detalle por referencia</h2>
                <Listado<AnalisisStock>
                    metaTabla={metaTablaStock}
                    criteriaInicial={criteriaInicial}
                    criteria={criteria}
                    entidades={datosPaginados}
                    totalEntidades={total}
                    cargando={cargando}
                    seleccionada={undefined}
                    onSeleccion={() => {}}
                    onCriteriaChanged={handleCriteriaChanged}
                />
            </div>
        </div>
    );
};
