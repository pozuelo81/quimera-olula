import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { puede } from "@olula/lib/dominio.ts";
import { preferencias } from "@olula/lib/preferencias.ts";
import { useEffect } from "react";
import { AsientoDeDocumento } from "#/contabilidad/asiento/vistas/detalle/AsientoDeDocumento.tsx";
import { ejercicioActual, PREFERENCIA_EJERCICIO_ACTUAL } from "#/contabilidad/asiento/dominio.ts";
import { CerrarEjercicio } from "../cerrar/CerrarEjercicio.tsx";
import { DeshacerCierreEjercicio } from "../deshacer_cierre/DeshacerCierreEjercicio.tsx";
import { Ejercicio } from "../diseño.ts";
import {
    asientosDelEjercicio,
    etiquetaEjercicio,
    puedeCerrar,
    puedeDeshacerCierre,
    puedeGenerarPgc,
} from "../dominio.ts";
import { GenerarPgcEjercicio } from "../generar_pgc/GenerarPgcEjercicio.tsx";
import { SeriesEjercicio } from "../series/SeriesEjercicio.tsx";
import { DatosEjercicio } from "./DatosEjercicio.tsx";
import { patchEjercicioActual } from "../infraestructura.ts";
import { contextoDetalleEjercicioInicial } from "./detalle.ts";
import { getMaquina } from "./maquina.ts";

export const DetalleEjercicio = ({
    id,
    ejercicios,
    publicar = async () => {},
}: {
    id?: string;
    ejercicios: Ejercicio[];
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoDetalleEjercicioInicial, publicar);
    const { estado, ejercicio, siguiente } = ctx;

    useEffect(() => {
        emitir("ejercicio_id_cambiada", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!ejercicio.id) return null;

    const autorizado = puede("contabilidad.asiento");
    const esActual = ejercicioActual() === ejercicio.id;
    const claveDatos = [ejercicio.id, ejercicio.nombre, ejercicio.fechaInicio.getTime(),
        ejercicio.fechaFin.getTime(), ejercicio.digitosSubcuenta, ejercicio.tienePgc].join("|");

    const marcarActual = async () => {
        await patchEjercicioActual(ejercicio.id);
        try {
            preferencias.set(PREFERENCIA_EJERCICIO_ACTUAL, ejercicio.id);
        } catch {
            // Sin almacenamiento local queda guardado solo en el servidor.
        }
        await emitir("ejercicio_actual_cambiado");
    };

    const acciones = [
        { texto: "Usar como ejercicio actual", onClick: marcarActual,
            deshabilitado: !autorizado || esActual },
        { texto: "Generar PGC", onClick: () => emitir("generar_pgc_solicitado"),
            deshabilitado: !autorizado || !puedeGenerarPgc(ejercicio) },
        { texto: "Cerrar ejercicio", onClick: () => emitir("cierre_solicitado"),
            deshabilitado: !autorizado || !puedeCerrar(ejercicio) },
        { texto: "Deshacer cierre", onClick: () => emitir("deshacer_cierre_solicitado"),
            deshabilitado: !autorizado || !puedeDeshacerCierre(ejercicio), advertencia: true },
    ];

    const campo = (label: string, nombre: string, valor: string) => (
        <QInput label={label} nombre={nombre} valor={valor} soloLectura />
    );

    return (
        <Detalle
            id={id}
            obtenerTitulo={etiquetaEjercicio}
            setEntidad={() => {}}
            entidad={ejercicio}
            cerrarDetalle={() => emitir("ejercicio_deseleccionado", null, true)}
        >
            <div className="DetalleEjercicio">
                <div className="maestro-botones">
                    <QuimeraAcciones acciones={acciones} vertical />
                </div>
                <quimera-formulario>
                    {campo("Código", "id", ejercicio.id)}
                    <DatosEjercicio
                        key={claveDatos}
                        ejercicio={ejercicio}
                        editable={autorizado}
                        onGuardado={() => emitir("datos_guardados")}
                    />
                    {campo("Estado", "estado", ejercicio.estado + (esActual ? " (ejercicio actual)" : ""))}
                    {campo("Plan contable", "tienePgc", ejercicio.tienePgc ? `PGC ${ejercicio.planContable || "08"}` : "Sin plan contable")}
                </quimera-formulario>
                <SeriesEjercicio ejercicio={ejercicio} ejercicios={ejercicios} editable={autorizado} />
                {asientosDelEjercicio(ejercicio, siguiente).map(({ titulo, asientoId }) => (
                    <AsientoDeDocumento
                        key={asientoId}
                        asientoId={asientoId}
                        conCabecera={false}
                        titulo={titulo}
                    />
                ))}
            </div>

            {estado === "GENERANDO_PGC" && (
                <GenerarPgcEjercicio ejercicio={ejercicio} ejercicios={ejercicios} publicar={emitir} />
            )}
            {estado === "CERRANDO" && (
                <CerrarEjercicio ejercicio={ejercicio} ejercicios={ejercicios} publicar={emitir} />
            )}
            {estado === "DESHACIENDO" && (
                <DeshacerCierreEjercicio ejercicio={ejercicio} publicar={emitir} />
            )}
        </Detalle>
    );
};
