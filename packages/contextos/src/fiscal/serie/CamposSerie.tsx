import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { FilaFormulario } from "#/contabilidad/comun/componentes/FilaFormulario.tsx";
import { PropsCampos } from "../comun/maestro/diseño.ts";
import { Serie } from "./diseño.ts";

/** Formulario de series.ui: Impuestos, Contabilidad y Veri*Factu. */
export const CamposSerie = ({ uiProps, entidad }: PropsCampos<Serie>) => (
    <>
        <QInput label="Descripción" {...uiProps("descripcion")} />
        <h3>Impuestos</h3>
        <FilaFormulario>
            <QInput label="% I.R.P.F." {...uiProps("irpf")} />
            <QCheckbox label="Sin I.V.A." {...uiProps("sinIva")} />
        </FilaFormulario>
        <h3>Contabilidad</h3>
        <FilaFormulario columnas={entidad ? "minmax(0, 1fr) minmax(0, 2fr)" : undefined}>
            <QInput label="Cuenta de ventas" {...uiProps("codigoCuenta")} />
            {entidad && <QInput label="Nombre" nombre="descripcion_cuenta"
                valor={entidad.descripcionCuenta} soloLectura />}
        </FilaFormulario>
        <FilaFormulario columnas={entidad ? "minmax(0, 1fr) minmax(0, 2fr)" : undefined}>
            <QInput label="Subcuenta de ventas" {...uiProps("codigoSubcuenta")} />
            {entidad && <QInput label="Nombre" nombre="descripcion_subcuenta"
                valor={entidad.descripcionSubcuenta} soloLectura />}
        </FilaFormulario>
        <h3>Veri*Factu</h3>
        <FilaFormulario>
            <QCheckbox label="Rectificativa" {...uiProps("rectificativa")} />
            <QCheckbox label="Simplificada" {...uiProps("simplificada")} />
        </FilaFormulario>
    </>
);
