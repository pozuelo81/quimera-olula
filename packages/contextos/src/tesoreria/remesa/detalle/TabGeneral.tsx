import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { FormModelo } from "@olula/lib/dominio.js";
import "./TabGeneral.css";

interface TabGeneralProps {
    form: FormModelo;
}

export const TabGeneral = ({ form }: TabGeneralProps) => {

    const { uiProps } = form;

    return (
        <div className="TabGeneral">
            <quimera-formulario>
                <QInput label="Fecha" {...uiProps("fecha")} />
                <QInput label="Fecha de cargo" {...uiProps("fechaCargo")} />
                <QInput label="Estado" {...uiProps("estado")} />
                <QInput label="Cuenta" {...uiProps("cuentaId")} />
                <QInput label="Total" {...uiProps("total")} />
                <QInput label="Divisa" {...uiProps("divisaId")} />
                <QInput label="Empresa" {...uiProps("empresaId")} />
            </quimera-formulario>
        </div>
    );
};
