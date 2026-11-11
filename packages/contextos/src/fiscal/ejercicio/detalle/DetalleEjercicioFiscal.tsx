import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { puede } from "@olula/lib/dominio.ts";
import { preferencias } from "@olula/lib/preferencias.ts";
import { useEffect } from "react";
import { ejercicioActual, PREFERENCIA_EJERCICIO_ACTUAL } from "#/contabilidad/asiento/dominio.ts";
import { FilaFormulario } from "#/contabilidad/comun/componentes/FilaFormulario.tsx";
import { AsientosEjercicio } from "#/contabilidad/ejercicio/asientos/AsientosEjercicio.tsx";
import { PropsDetalleEjercicio } from "#/contabilidad/ejercicio/detalle/DetalleEjercicio.tsx";
import { contextoDetalleEjercicioInicial } from "#/contabilidad/ejercicio/detalle/detalle.ts";
import { getMaquina } from "#/contabilidad/ejercicio/detalle/maquina.ts";
import { etiquetaEjercicio, puedeGenerarPgc } from "#/contabilidad/ejercicio/dominio.ts";
import { GenerarPgcEjercicio } from "#/contabilidad/ejercicio/generar_pgc/GenerarPgcEjercicio.tsx";
import { patchEjercicioActual } from "#/contabilidad/ejercicio/infraestructura.ts";
import { SeriesEjercicio } from "../series/SeriesEjercicio.tsx";
import { DatosEjercicio } from "./DatosEjercicio.tsx";

/** Edición de Fiscalidad > Ejercicios fiscales (ejercicios.ui de facturación).
 * El cierre y la reapertura están en Contabilidad > Apertura y Cierre de
 * Ejercicio. */
export const DetalleEjercicioFiscal = ({
    id,
    ejercicios,
    publicar = async () => {},
}: PropsDetalleEjercicio) => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoDetalleEjercicioInicial, publicar);
    const { estado, ejercicio } = ctx;

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
                    <DatosEjercicio
                        key={claveDatos}
                        ejercicio={ejercicio}
                        editable={autorizado}
                        onGuardado={() => emitir("datos_guardados")}
                    />
                    <FilaFormulario>
                        {campo("Estado", "estado", ejercicio.estado + (esActual ? " (ejercicio actual)" : ""))}
                        {campo("Plan contable", "tienePgc", ejercicio.tienePgc ? `PGC ${ejercicio.planContable || "08"}` : "Sin plan contable")}
                    </FilaFormulario>
                </quimera-formulario>
                <h3>Series</h3>
                <SeriesEjercicio ejercicio={ejercicio} ejercicios={ejercicios} editable={autorizado} />
                <h3>Asientos</h3>
                <AsientosEjercicio ejercicio={ejercicio} />
            </div>

            {estado === "GENERANDO_PGC" && (
                <GenerarPgcEjercicio ejercicio={ejercicio} ejercicios={ejercicios} publicar={emitir} />
            )}
        </Detalle>
    );
};
