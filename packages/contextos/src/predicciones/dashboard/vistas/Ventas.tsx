import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { QTarjetaResumen } from "@olula/componentes/atomos/qtarjeta_resumen.tsx";
import { QBoton } from "@olula/componentes/index.ts";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.ts";
import { useCallback, useEffect, useState } from "react";
import { PeriodoPrediccion, PrediccionFacturacion, PrediccionVentasReferencia, PrediccionVentasSubfamilia } from "../diseño.ts";
import { agruparPorSubfamilia, calcularTarjetas, NOMBRES_MES } from "../dominio.ts";
import {
    obtenerPrediccionesFacturacionMensual,
    obtenerPrediccionesFacturacionSemanal,
    obtenerVentasReferencia,
    obtenerVentasReferenciaSemanal,
} from "../infraestructura.ts";
import { GraficoMensual, GraficoSemanal, GraficoSubfamilia } from "./graficos.tsx";
import "./ventas.css";

const metaTablaVentasRef: MetaTabla<PrediccionVentasReferencia> = [
    { id: "referencia", cabecera: "Referencia" },
    { id: "subfamilia", cabecera: "Subfamilia" },
    { id: "familia", cabecera: "Familia" },
    { id: "pvp", cabecera: "PVP", tipo: "moneda" },
    {
        id: "fecha",
        cabecera: "Mes",
        render: (e) => {
            const fecha = new Date(e.fecha);
            return `${NOMBRES_MES[fecha.getMonth()]} ${fecha.getFullYear()}`;
        },
    },
    {
        id: "ventasPrediccion",
        cabecera: "Predicción",
        tipo: "numero",
        render: (e) => Math.round(e.ventasPrediccion).toLocaleString(),
    },
];

const criteriaInicialRef: Criteria = {
    ...criteriaDefecto,
    orden: ["referencia", "ASC"],
    paginacion: { pagina: 1, limite: 25 },
};

export const Ventas = () => {
    const [periodo, setPeriodo] = useState<PeriodoPrediccion>("mensual");
    const [datosMensual, setDatosMensual] = useState<PrediccionFacturacion[]>([]);
    const [datosSemanal, setDatosSemanal] = useState<PrediccionFacturacion[]>([]);
    const [cargandoMensual, setCargandoMensual] = useState(true);
    const [cargandoSemanal, setCargandoSemanal] = useState(true);

    const [criteriaRef, setCriteriaRef] = useState<Criteria>(criteriaInicialRef);
    const [ventasRef, setVentasRef] = useState<PrediccionVentasReferencia[]>([]);
    const [totalVentasRef, setTotalVentasRef] = useState(0);
    const [cargandoVentasRef, setCargandoVentasRef] = useState(true);

    const [ventasSubfamilia, setVentasSubfamilia] = useState<PrediccionVentasSubfamilia[]>([]);
    const [cargandoVentasSubfamilia, setCargandoVentasSubfamilia] = useState(true);

    const cargarVentasRef = useCallback((criteria: Criteria) => {
        setCargandoVentasRef(true);
        obtenerVentasReferencia(criteria.filtro, criteria.orden, criteria.paginacion)
            .then((resultado) => {
                setVentasRef(resultado.datos);
                setTotalVentasRef(prev => resultado.total > 0 ? resultado.total : prev);
            })
            .finally(() => setCargandoVentasRef(false));
    }, []);

    useEffect(() => {
        obtenerPrediccionesFacturacionMensual()
            .then(setDatosMensual)
            .finally(() => setCargandoMensual(false));
        obtenerPrediccionesFacturacionSemanal()
            .then(setDatosSemanal)
            .finally(() => setCargandoSemanal(false));
        cargarVentasRef(criteriaInicialRef);
        setCargandoVentasSubfamilia(true);
        obtenerVentasReferenciaSemanal([], ["subfamilia", "ASC"], { pagina: 1, limite: 10000 })
            .then((resultado) => setVentasSubfamilia(agruparPorSubfamilia(resultado.datos)))
            .finally(() => setCargandoVentasSubfamilia(false));
    }, []);

    const handleCriteriaChanged = useCallback((criteria: Criteria) => {
        setCriteriaRef(criteria);
        cargarVentasRef(criteria);
    }, [cargarVentasRef]);

    const cargandoTarjetas = cargandoMensual || cargandoSemanal;
    const tarjetas = cargandoTarjetas ? [] : calcularTarjetas(datosMensual, datosSemanal);
    const cargandoGrafico = periodo === "mensual" ? cargandoMensual : cargandoSemanal;

    return (
        <div className="dashboard">
            <h1>Predicciones de Ventas</h1>

            <div className="dashboard-tarjetas">
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

            <div className="dashboard-fila">
                <div className="dashboard-seccion dashboard-fila-principal">
                    <div className="dashboard-seccion-cabecera">
                        <h2>
                            Evolución de facturación {periodo === "mensual" ? "mensual" : "semanal"}
                        </h2>
                        <div className="dashboard-periodo">
                            <QBoton
                                variante={periodo === "mensual" ? "solido" : "borde"}
                                tamaño="pequeño"
                                onClick={() => setPeriodo("mensual")}
                            >
                                Mensual
                            </QBoton>
                            <QBoton
                                variante={periodo === "semanal" ? "solido" : "borde"}
                                tamaño="pequeño"
                                onClick={() => setPeriodo("semanal")}
                            >
                                Semanal
                            </QBoton>
                        </div>
                    </div>
                    <div className="dashboard-grafico">
                        {cargandoGrafico ? (
                            <div className="dashboard-grafico-cargando">Cargando datos...</div>
                        ) : periodo === "mensual" ? (
                            <GraficoMensual datos={datosMensual} />
                        ) : (
                            <GraficoSemanal datos={datosSemanal} />
                        )}
                    </div>
                </div>

                <div className="dashboard-seccion dashboard-fila-secundaria">
                    <h2>Predicción semanal por subfamilia</h2>
                    <div className="dashboard-grafico">
                        {cargandoVentasSubfamilia ? (
                            <div className="dashboard-grafico-cargando">Cargando datos...</div>
                        ) : (
                            <GraficoSubfamilia datos={ventasSubfamilia} />
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-seccion">
                <h2>Predicción de ventas por referencia</h2>
                <Listado<PrediccionVentasReferencia>
                    metaTabla={metaTablaVentasRef}
                    criteriaInicial={criteriaInicialRef}
                    criteria={criteriaRef}
                    entidades={ventasRef}
                    totalEntidades={totalVentasRef}
                    cargando={cargandoVentasRef}
                    seleccionada={undefined}
                    onSeleccion={() => {}}
                    onCriteriaChanged={handleCriteriaChanged}
                />
            </div>
        </div>
    );
};
