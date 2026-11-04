import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { puede } from "@olula/lib/dominio.ts";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { useEffect, useMemo } from "react";
import { CrearEjercicio } from "../crear/CrearEjercicio.tsx";
import { DetalleEjercicio } from "../detalle/DetalleEjercicio.tsx";
import { Ejercicio } from "../diseño.ts";
import { criteriaEjerciciosDefecto, metaTablaEjercicio } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

/** Ejercicios contables (Eneboo masterejercicios + co_cerrarejer). */
export const MaestroConDetalleEjercicio = () => {

    const criteriaInicial = useMemo(criteriaEjerciciosDefecto, []);

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        ejercicios: listaActivaEntidadesInicial<Ejercicio>(undefined, criteriaInicial),
    });

    const { estado, ejercicios } = ctx;
    const autorizado = puede("contabilidad.asiento");

    useEffect(() => {
        if (!autorizado) return;
        emitir("recarga_de_ejercicios_solicitada", ejercicios.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!autorizado) {
        return <p>No tienes permiso para ver los ejercicios.</p>;
    }

    return (
        <div className="Ejercicio">
            <MaestroDetalle<Ejercicio>
                seleccionada={ejercicios.activo}
                Maestro={
                    <>
                        <h2>Ejercicios</h2>
                        <Listado<Ejercicio>
                            metaTabla={metaTablaEjercicio}
                            criteria={ejercicios.criteria}
                            modoInicial="tabla"
                            entidades={ejercicios.lista}
                            totalEntidades={ejercicios.total}
                            seleccionada={ejercicios.activo}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    <QBoton onClick={() => emitir("crear_ejercicio_solicitado")}>
                                        Nuevo ejercicio
                                    </QBoton>
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("ejercicio_seleccionado", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={
                    <DetalleEjercicio
                        id={ejercicios.activo}
                        ejercicios={ejercicios.lista}
                        publicar={emitir}
                    />
                }
            />

            {estado === "CREANDO" && (
                <CrearEjercicio publicar={emitir} ejercicios={ejercicios.lista} />
            )}
        </div>
    );
};
