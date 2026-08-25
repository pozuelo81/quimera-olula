import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useLayout } from "@olula/lib/useLayout.js";
import { useEffect, useMemo } from "react";
import { CrearProyecto } from "../crear/CrearProyecto.js";
import { DetalleProyecto } from "../detalle/DetalleProyecto.js";
import { getDescripcionEstado, Proyecto } from "../diseño.js";
import "./MaestroConDetalleProyecto.css";
import { getMaquina } from "./maquina.js";

const metaTablaProyecto: MetaTabla<Proyecto> = [
    { id: 'id', cabecera: 'ID' },
    { id: 'nombre', cabecera: 'Nombre' },
    { id: 'estado', cabecera: 'Estado', render: (p: Proyecto) => getDescripcionEstado(p.estado) },
    { id: 'fechaInicio', cabecera: 'Fecha inicio', tipo: 'fecha' },
    { id: 'fechaFin', cabecera: 'Fecha fin', tipo: 'fecha' },
];

export const MaestroConDetalleProyecto = () => {
    const criteriaBase = useMemo(() => criteriaDefecto, []);
    const { layout, cambiarLayout } = useLayout("TARJETA");
    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        proyectos: listaActivaEntidadesInicial<Proyecto>(id, criteriaInicial),
    });

    const { estado, proyectos } = ctx;

    useUrlParams(proyectos.activo, proyectos.criteria);

    useEffect(() => {
        emitir("recarga_de_proyectos_solicitada", proyectos.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Proyecto">
            <MaestroDetalle<Proyecto>
                Maestro={
                    <>
                        <h2>Proyectos</h2>
                        <div className="maestro-botones">
                            <span
                                className="cambio-modo-icono"
                                onClick={cambiarLayout}
                            >
                                <QIcono
                                    nombre={layout === "TABLA" ? "lista" : "tabla"}
                                    tamaño="md"
                                />
                            </span>
                        </div>
                        <Listado<Proyecto>
                            metaTabla={metaTablaProyecto}
                            criteria={proyectos.criteria}
                            modo={layout === "TARJETA" ? "tarjetas" : "tabla"}
                            tarjeta={TarjetaProyecto}
                            entidades={proyectos.lista}
                            totalEntidades={proyectos.total}
                            seleccionada={proyectos.activo}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    <QBoton onClick={() => emitir("crear_proyecto_solicitado")}>
                                        Nuevo Proyecto
                                    </QBoton>
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("proyecto_seleccionado", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={<DetalleProyecto id={proyectos.activo} publicar={emitir} />}
                layout={layout}
                seleccionada={proyectos.activo}
                modoDisposicion="maestro-50"
            />
            {estado === "CREANDO" && (
                <CrearProyecto publicar={emitir} />
            )}
        </div>
    );
};

const TarjetaProyecto = (proyecto: Proyecto) => {
    return (
        <div className="tarjeta-proyecto" key={proyecto.id}>
            <div className="tarjeta-proyecto-nombre">{proyecto.nombre}</div>
            <div className={`tarjeta-proyecto-estado estado-${proyecto.estado}`}>
                {getDescripcionEstado(proyecto.estado)}
            </div>
        </div>
    );
};
