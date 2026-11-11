import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { FilaFormulario } from "#/contabilidad/comun/componentes/FilaFormulario.tsx";
import { UiProps } from "../comun/maestro/diseño.ts";
import { SUBCUENTAS, TIPOS_BIENES } from "./subcuentas.ts";

const opcionesTipoBienes = TIPOS_BIENES.map((t) => ({ valor: t, descripcion: t }));

/** Formulario de impuestos.ui: porcentajes, tipo de bienes y subcuentas de
 * contabilidad (código con punto, completado con el ejercicio actual). */
export const CamposImpuesto = ({ uiProps }: { uiProps: UiProps }) => (
    <>
        <QInput label="Descripción" {...uiProps("descripcion")} />
        <FilaFormulario>
            <QInput label="% I.V.A." {...uiProps("iva")} />
            <QInput label="% Rec. equivalencia" {...uiProps("recargo")} />
            <QSelect label="Tipo de bienes" opciones={opcionesTipoBienes} {...uiProps("tipoBienes")} />
        </FilaFormulario>
        <h3>Contabilidad</h3>
        {SUBCUENTAS.map(({ sufijo, etiqueta }) => (
            <QInput key={sufijo} label={etiqueta} {...uiProps(`sc_${sufijo}`)} />
        ))}
    </>
);
