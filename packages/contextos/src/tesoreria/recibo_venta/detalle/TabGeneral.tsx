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
                <QInput label="Código" {...uiProps("codigo")} />
                <QInput label="Estado" {...uiProps("estado")} />
                <QInput label="Importe" {...uiProps("importe")} />
                <QInput label="Fecha de emisión" {...uiProps("fechaEmision")} />
                <QInput label="Fecha de vencimiento" {...uiProps("fechaVencimiento")} />
                <QInput label="Cliente" {...uiProps("clienteId")} />
                <QInput label="ID Fiscal" {...uiProps("idFiscal")} />
                <QInput label="Factura" {...uiProps("facturaId")} />
            </quimera-formulario>
        </div>
    );
};
