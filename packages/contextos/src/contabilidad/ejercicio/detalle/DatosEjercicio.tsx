import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { FilaFormulario } from "#/contabilidad/comun/componentes/FilaFormulario.tsx";
import { DatosEjercicio as Datos, Ejercicio } from "../diseño.ts";
import { cambiosDatosEjercicio, datosEjercicio, metaDatosEjercicio } from "../dominio.ts";
import { patchDatosEjercicio } from "../infraestructura.ts";

/** Cabecera editable de `ejercicios.ui`: nombre, fechas y longitud de
 * subcuenta (bloqueada si el ejercicio ya tiene PGC, como ejercicios.qs). */
export const DatosEjercicio = ({
    ejercicio,
    editable,
    onGuardado,
}: {
    ejercicio: Ejercicio;
    editable: boolean;
    onGuardado: () => Promise<void>;
}) => {
    const inicial = useMemo(() => datosEjercicio(ejercicio), [ejercicio]);

    const guardar = useCallback(async (datos: Datos) => {
        const cambios = cambiosDatosEjercicio(inicial, datos);
        if (Object.keys(cambios).length === 0) return;
        await patchDatosEjercicio(ejercicio.id, cambios);
        await onGuardado();
    }, [ejercicio.id, inicial, onGuardado]);

    const { uiProps } = useModelo(metaDatosEjercicio, inicial, guardar);

    return (
        <>
            <QInput label="Nombre" {...uiProps("nombre")} deshabilitado={!editable} />
            <FilaFormulario>
                <QDate label="Inicio" {...uiProps("fechaInicio")} deshabilitado={!editable} />
                <QDate label="Fin" {...uiProps("fechaFin")} deshabilitado={!editable} />
                <QInput label="Dígitos de subcuenta" {...uiProps("digitosSubcuenta")}
                    deshabilitado={!editable || ejercicio.tienePgc} />
            </FilaFormulario>
        </>
    );
};
