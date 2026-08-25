import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useFocus } from "@olula/lib/useFocus.ts";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { postProyecto } from "../infraestructura.js";
import "./CrearProyecto.css";
import { metaNuevoProyecto, nuevoProyectoInicial } from "./crear.js";

export const CrearProyecto = ({
    publicar,
}: {
    publicar: EmitirEvento;
}) => {
    const { modelo: proyecto, uiProps, valido } = useModelo(
        metaNuevoProyecto,
        nuevoProyectoInicial
    );

    const crear_ = useCallback(
        async () => {
            const id = await postProyecto(proyecto);
            publicar("proyecto_creado", id);
        },
        [proyecto, publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("alta_de_proyecto_cancelada"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);
    const focus = useFocus();

    return (
        <QModal abierto={true} nombre="crearProyecto" titulo="Crear proyecto" onCerrar={cancelar}>
            <div className="CrearProyecto">
                <quimera-formulario>
                    <QInput label="Nombre" {...uiProps("nombre")} ref={focus} />
                    <Cliente {...uiProps("idCliente", "nombreCliente")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
