import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useFocus } from "@olula/lib/useFocus.ts";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { Ejercicio } from "../diseño.ts";
import { etiquetaEjercicio, nuevoEjercicioPropuesto } from "../dominio.ts";
import { postEjercicio } from "../infraestructura.ts";
import { metaNuevoEjercicio } from "./crear.ts";

export const CrearEjercicio = ({
    publicar,
    ejercicios,
}: {
    publicar: EmitirEvento;
    ejercicios: Ejercicio[];
}) => {
    const inicial = useMemo(() => nuevoEjercicioPropuesto(ejercicios), [ejercicios]);
    const { modelo, uiProps, valido } = useModelo(metaNuevoEjercicio, inicial);

    const opcionesPgc = useMemo(() => [
        { valor: "", descripcion: "Generar PGC 2008 nuevo" },
        ...ejercicios.filter((e) => e.tienePgc).map((e) => ({
            valor: e.id, descripcion: `Copiar de ${etiquetaEjercicio(e)}`,
        })),
    ], [ejercicios]);

    const crear_ = useCallback(async () => {
        const id = await postEjercicio(modelo, ejercicios[0]?.empresaId ?? null);
        publicar("ejercicio_creado", id);
    }, [modelo, ejercicios, publicar]);

    const cancelar_ = useCallback(() => publicar("alta_de_ejercicio_cancelada"), [publicar]);
    const [crear, cancelar] = useForm(crear_, cancelar_);
    const focus = useFocus();

    return (
        <QModal abierto={true} nombre="crearEjercicio" titulo="Nuevo ejercicio" onCerrar={cancelar}>
            <div className="CrearEjercicio">
                <quimera-formulario>
                    <QInput label="Código" {...uiProps("id")} ref={focus} />
                    <QInput label="Nombre" {...uiProps("nombre")} />
                    <QDate label="Inicio" {...uiProps("fechaInicio")} />
                    <QDate label="Fin" {...uiProps("fechaFin")} />
                    <QSelect label="Plan contable" opciones={opcionesPgc} {...uiProps("ejercicioOrigenPgc")} />
                    {!modelo.ejercicioOrigenPgc && (
                        <QInput label="Dígitos de subcuenta" {...uiProps("digitosSubcuenta")} />
                    )}
                    <QInput label="Series (separadas por comas)" {...uiProps("series")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>Crear</QBoton>
                </div>
            </div>
        </QModal>
    );
};
