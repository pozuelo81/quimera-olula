import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { MetaTabla } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Ejercicio, SerieEjercicio } from "../diseño.ts";
import { etiquetaEjercicio } from "../dominio.ts";
import {
    deleteSerieEjercicio,
    getOpcionesSeries,
    getSeriesEjercicio,
    postCopiarSeries,
    postSerieEjercicio,
} from "../infraestructura.ts";

const metaTablaSeries: MetaTabla<SerieEjercicio> = [
    { id: "serieId", cabecera: "Serie" },
    { id: "descripcion", cabecera: "Descripción" },
];

/** Pestaña «Series» de `ejercicios.ui` (secuenciasejercicios): añadir, quitar y
 * «Copiar series» de otro ejercicio (solo añade las que faltan). */
export const SeriesEjercicio = ({
    ejercicio,
    ejercicios,
    editable,
}: {
    ejercicio: Ejercicio;
    ejercicios: Ejercicio[];
    editable: boolean;
}) => {
    const { intentar } = useContext(ContextoError);
    const [series, setSeries] = useState<SerieEjercicio[]>([]);
    const [cargando, setCargando] = useState(true);
    const [activa, setActiva] = useState<SerieEjercicio | null>(null);
    const [opcionesSeries, setOpcionesSeries] = useState<{ valor: string; descripcion: string }[]>([]);
    const [serieNueva, setSerieNueva] = useState("");
    const [origen, setOrigen] = useState("");

    const recargar = useCallback(async () => {
        setCargando(true);
        try {
            setSeries(await getSeriesEjercicio(ejercicio.id));
        } finally {
            setCargando(false);
        }
    }, [ejercicio.id]);

    useEffect(() => { recargar(); }, [recargar]);
    useEffect(() => { getOpcionesSeries().then(setOpcionesSeries).catch(() => setOpcionesSeries([])); }, []);

    const libres = useMemo(
        () => opcionesSeries.filter((o) => !series.some((s) => s.serieId === o.valor)),
        [opcionesSeries, series],
    );
    const otrosEjercicios = useMemo(
        () => ejercicios.filter((e) => e.id !== ejercicio.id)
            .map((e) => ({ valor: e.id, descripcion: etiquetaEjercicio(e) })),
        [ejercicios, ejercicio.id],
    );

    const anadir = async () => {
        if (!serieNueva) return;
        await intentar(() => postSerieEjercicio(ejercicio.id, serieNueva));
        setSerieNueva("");
        await recargar();
    };

    const quitar = async () => {
        if (!activa) return;
        await intentar(() => deleteSerieEjercicio(ejercicio.id, activa.serieId));
        setActiva(null);
        await recargar();
    };

    const copiar = async () => {
        if (!origen) return;
        await intentar(() => postCopiarSeries(ejercicio.id, origen));
        setOrigen("");
        await recargar();
    };

    return (
        <div className="SeriesEjercicio">
            <h3>Series</h3>
            {editable && (
                <quimera-formulario>
                    <QSelect label="Serie" nombre="serie_nueva" valor={serieNueva} opcional
                        opciones={libres} onChange={(o) => setSerieNueva(o?.valor ?? "")} />
                    <QSelect label="Copiar series de" nombre="ejercicio_origen_series" valor={origen}
                        opcional opciones={otrosEjercicios} onChange={(o) => setOrigen(o?.valor ?? "")} />
                </quimera-formulario>
            )}
            {editable && (
                <div className="botones maestro-botones">
                    <QBoton onClick={anadir} deshabilitado={!serieNueva}>Añadir serie</QBoton>
                    <QBoton onClick={quitar} deshabilitado={!activa}>Quitar serie</QBoton>
                    <QBoton onClick={copiar} deshabilitado={!origen}>Copiar series</QBoton>
                </div>
            )}
            <QTabla metaTabla={metaTablaSeries} datos={series} cargando={cargando}
                seleccionadaId={activa?.id} onSeleccion={setActiva}
                orden={["serieId", "ASC"]} totalEntidades={series.length} />
        </div>
    );
};
