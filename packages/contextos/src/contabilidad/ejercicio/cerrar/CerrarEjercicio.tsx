import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { MetaModelo } from "@olula/lib/dominio.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo, useState } from "react";
import { Ejercicio, OpcionesCierre } from "../diseño.ts";
import {
    esAvisoCuentasSinCodigoBalance,
    etiquetaEjercicio,
    opcionesCierreIniciales,
    textoAviso,
} from "../dominio.ts";
import { patchCerrarEjercicio } from "../infraestructura.ts";

const metaOpcionesCierre: MetaModelo<OpcionesCierre> = {
    campos: {
        fecha: { requerido: true, tipo: "fecha" },
        regularizar: { tipo: "checkbox" },
        cerrar: { tipo: "checkbox" },
        abrir: { tipo: "checkbox" },
        ejercicioDestinoId: { requerido: false, tipo: "selector" },
        ignorarCuentasSinCodigoBalance: { tipo: "checkbox" },
    },
    validacion: (m) =>
        m.regularizar || m.cerrar || m.abrir ? true : "Marque al menos un asiento",
};

/** co_cerrarejer: asiento de pérdidas y ganancias, de cierre y de apertura. */
export const CerrarEjercicio = ({
    ejercicio,
    ejercicios,
    publicar,
}: {
    ejercicio: Ejercicio;
    ejercicios: Ejercicio[];
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(
        () => opcionesCierreIniciales(ejercicio, ejercicios),
        [ejercicio, ejercicios]
    );
    const { modelo, uiProps, valido } = useModelo(metaOpcionesCierre, inicial);
    const [aviso, setAviso] = useState("");

    const destinos = useMemo(() => [
        { valor: "", descripcion: "Crear el ejercicio siguiente" },
        ...ejercicios
            .filter((e) => e.estado === "ABIERTO"
                && e.fechaInicio.getTime() > ejercicio.fechaInicio.getTime())
            .map((e) => ({ valor: e.id, descripcion: etiquetaEjercicio(e) })),
    ], [ejercicios, ejercicio.fechaInicio]);

    const aceptar_ = useCallback(async () => {
        try {
            await patchCerrarEjercicio(ejercicio.id, {
                ...modelo,
                ignorarCuentasSinCodigoBalance: !!aviso || modelo.ignorarCuentasSinCodigoBalance,
            });
        } catch (error) {
            if (esAvisoCuentasSinCodigoBalance(error) && !aviso) {
                setAviso(textoAviso(error));
                return;
            }
            throw error;
        }
        publicar("ejercicio_cerrado");
    }, [ejercicio.id, modelo, aviso, publicar]);
    const [aceptar, cancelar] = useForm(aceptar_, () => publicar("cancelado"));

    return (
        <QModal abierto={true} nombre="cerrarEjercicio"
            titulo={`Cierre del ejercicio ${etiquetaEjercicio(ejercicio)}`}
            onCerrar={cancelar}>
            <quimera-formulario>
                <QDate label="Fecha de los asientos de regularización y cierre" {...uiProps("fecha")} />
                <QCheckbox label="Asiento de pérdidas y ganancias" {...uiProps("regularizar")} />
                <QCheckbox label="Asiento de cierre (deja el ejercicio cerrado)" {...uiProps("cerrar")} />
                <QCheckbox label="Asiento de apertura" {...uiProps("abrir")} />
                {modelo.abrir && (
                    <QSelect label="Ejercicio de apertura" opciones={destinos} {...uiProps("ejercicioDestinoId")} />
                )}
            </quimera-formulario>
            {aviso && (
                <p className="aviso">{aviso} Pulse de nuevo «Cerrar» para continuar.</p>
            )}
            <div className="botones maestro-botones">
                <QBoton onClick={aceptar} deshabilitado={!valido}>Cerrar</QBoton>
            </div>
        </QModal>
    );
};
