import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearFechaDate, puede } from "@olula/lib/dominio.ts";
import { preferencias } from "@olula/lib/preferencias.ts";
import { useEffect } from "react";
import { ejercicioActual, PREFERENCIA_EJERCICIO_ACTUAL } from "#/contabilidad/asiento/dominio.ts";
import { CerrarEjercicio } from "../cerrar/CerrarEjercicio.tsx";
import { DeshacerCierreEjercicio } from "../deshacer_cierre/DeshacerCierreEjercicio.tsx";
import { Ejercicio } from "../diseño.ts";
import {
    etiquetaEjercicio,
    puedeCerrar,
    puedeDeshacerCierre,
    puedeGenerarPgc,
} from "../dominio.ts";
import { GenerarPgcEjercicio } from "../generar_pgc/GenerarPgcEjercicio.tsx";
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
    const { estado, ejercicio } = ctx;

    useEffect(() => {
        emitir("ejercicio_id_cambiada", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!ejercicio.id) return null;

    const autorizado = puede("contabilidad.asiento");
    const esActual = ejercicioActual() === ejercicio.id;

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
    const asiento = (n: number | null) => (n ? String(n) : "");

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
                    {campo("Nombre", "nombre", ejercicio.nombre)}
                    {campo("Inicio", "fechaInicio", formatearFechaDate(ejercicio.fechaInicio))}
                    {campo("Fin", "fechaFin", formatearFechaDate(ejercicio.fechaFin))}
                    {campo("Estado", "estado", ejercicio.estado + (esActual ? " (ejercicio actual)" : ""))}
                    {campo("Dígitos de subcuenta", "digitosSubcuenta", String(ejercicio.digitosSubcuenta))}
                    {campo("Plan contable", "tienePgc", ejercicio.tienePgc ? `PGC ${ejercicio.planContable || "08"}` : "Sin plan contable")}
                    {campo("Asiento de apertura", "asientoAperturaId", asiento(ejercicio.asientoAperturaId))}
                    {campo("Asiento de pérdidas y ganancias", "asientoPygId", asiento(ejercicio.asientoPygId))}
                    {campo("Asiento de cierre", "asientoCierreId", asiento(ejercicio.asientoCierreId))}
                </quimera-formulario>
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
