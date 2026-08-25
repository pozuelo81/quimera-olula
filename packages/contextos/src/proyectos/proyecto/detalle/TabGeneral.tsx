import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { FormModelo } from "@olula/lib/dominio.js";
import { EstadoProyecto, getDescripcionEstado } from "../diseño.js";
import "./TabGeneral.css";

const opcionesEstado: EstadoProyecto[] = ['ABIERTO', 'EN_CURSO', 'SUSPENDIDO', 'CERRADO', 'CANCELADO'];

interface TabGeneralProps {
    form: FormModelo;
}

export const TabGeneral = ({ form }: TabGeneralProps) => {
    const { uiProps } = form;

    return (
        <div className="TabGeneral">
            <quimera-formulario>
                <QInput label="Nombre" {...uiProps("nombre")} />
                <QSelect
                    label="Estado"
                    {...uiProps("estado")}
                    opciones={opcionesEstado.map((e) => ({
                        valor: e,
                        descripcion: getDescripcionEstado(e),
                    }))}
                />
                <QInput label="Fecha inicio" {...uiProps("fechaInicio")} deshabilitado={true} />
                <QInput label="Fecha fin" {...uiProps("fechaFin")} />
            </quimera-formulario>
        </div>
    );
};
