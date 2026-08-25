import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { Divisa } from "#/ventas/comun/componentes/divisa.tsx";
import { FormaPago } from "#/ventas/comun/componentes/formapago.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { FormModelo } from "@olula/lib/dominio.js";
import "./TabValoresDefecto.css";

interface TabValoresDefectoProps {
    form: FormModelo;
}

export const TabValoresDefecto = ({ form }: TabValoresDefectoProps) => {

    const { uiProps } = form;

    return (
        <div className="TabValoresDefecto">
            <quimera-formulario>
                <Divisa {...uiProps("divisaId")} nombre="empresa/divisa_id" />
                <FormaPago {...uiProps("formaPagoId")} nombre="empresa/forma_pago_id" />
                <Almacen {...uiProps("almacenId")} nombre="empresa/almacen_id" />
                <QInput
                    label="Serie facturación"
                    {...uiProps("serieId")}
                    nombre="empresa/serie_id"
                />
            </quimera-formulario>
        </div>
    );
};
