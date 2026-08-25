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
                <QInput label="Referencia" {...uiProps("referencia")} />
                <QInput label="Tipo" {...uiProps("tipo")} />
                <QInput label="Tipo de pago" {...uiProps("tipoPago")} />
                <QInput label="Descripción" {...uiProps("descripcion")} />
                <QInput label="Cliente" {...uiProps("clienteId")} />
                <QInput label="Nº de efectos" {...uiProps("numEfectos")} />
                <QInput label="Cuenta" {...uiProps("cuentaId")} />
                <QInput label="Cuenta del cliente" {...uiProps("cuentaClienteId")} />
            </quimera-formulario>
        </div>
    );
};
