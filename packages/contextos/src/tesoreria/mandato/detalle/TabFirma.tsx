import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { FormModelo } from "@olula/lib/dominio.js";
import "./TabFirma.css";

interface TabFirmaProps {
    form: FormModelo;
}

export const TabFirma = ({ form }: TabFirmaProps) => {

    const { uiProps } = form;

    return (
        <div className="TabFirma">
            <quimera-formulario>
                <QInput label="Fecha de firma" {...uiProps("fechaFirma")} />
                <QInput label="Lugar de firma" {...uiProps("lugarFirma")} />
                <QInput label="Fecha último adeudo" {...uiProps("fechaUltimoAdeudo")} />
                <QInput label="Fecha de caducidad" {...uiProps("fechaCaducidad")} />
            </quimera-formulario>
        </div>
    );
};
