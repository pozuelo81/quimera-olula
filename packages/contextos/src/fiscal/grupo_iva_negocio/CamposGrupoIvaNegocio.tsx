import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { FilaFormulario } from "#/contabilidad/comun/componentes/FilaFormulario.tsx";
import { UiProps } from "../comun/maestro/diseño.ts";
import FISCAL_Urls from "../comun/urls.ts";
import { useOpciones } from "../comun/useOpciones.ts";

const urls = new FISCAL_Urls();

const REGIMENES_IVA = [
    { valor: "", descripcion: "(Sin régimen)" },
    { valor: "General", descripcion: "General" },
    { valor: "Exportaciones", descripcion: "Exportaciones" },
    { valor: "U.E.", descripcion: "U.E." },
    { valor: "Exento", descripcion: "Exento" },
];

/** Formulario veri_gruposcontivaneg.ui: grupo, modelos, SII, Veri*Factu y
 * comportamiento del IVA. */
export const CamposGrupoIvaNegocio = ({ uiProps }: { uiProps: UiProps }) => {
    const regimenes = useOpciones(urls.REGIMEN_IVA_VERIFACTU);
    const causas = useOpciones(urls.CAUSA_EXENCION_IVA);
    return (
        <>
            <QInput label="Descripción" {...uiProps("descripcion")} />
            <h3>Modelos</h3>
            <QCheckbox label="Asociar a modelo 349" {...uiProps("modelo349")} />
            <h3>SII</h3>
            <FilaFormulario>
                <QInput label="Rég. especial emitidas" {...uiProps("siiClaveOperacionEmitidas")} />
                <QInput label="Rég. especial recibidas" {...uiProps("siiClaveOperacionRecibidas")} />
            </FilaFormulario>
            <FilaFormulario>
                <QInput label="Operación sujeta - Tipo" {...uiProps("siiTipoNoExentaEmitidas")} />
                <QInput label="Operación sujeta exenta - Causa" {...uiProps("siiCausaExentaEmitidas")} />
            </FilaFormulario>
            <h3>Veri*Factu</h3>
            <QSelect label="Régimen I.V.A." opciones={REGIMENES_IVA} {...uiProps("regimenIva")} />
            <QSelect label="Régimen I.V.A. Verifactu" opciones={regimenes}
                {...uiProps("regimenIvaVerifactu")} />
            <QSelect label="Causa exención IVA Verifactu" opciones={causas}
                {...uiProps("causaExencionIvaVerifactu")} />
            <h3>I.V.A.</h3>
            <FilaFormulario>
                <QCheckbox label="Inversión del sujeto pasivo" {...uiProps("isp")} />
                <QCheckbox label="Sin I.V.A." {...uiProps("sinIva")} />
                <QCheckbox label="Aplicar Recargo Eq." {...uiProps("aplicarRecargo")} />
            </FilaFormulario>
            <FilaFormulario>
                <QCheckbox label="Exenta" {...uiProps("siiExentaIva")} />
                <QCheckbox label="Servicios" {...uiProps("siiServicios")} />
                <QCheckbox label="Ventas a distancia" {...uiProps("ventasADistancia")} />
            </FilaFormulario>
            <FilaFormulario>
                <QCheckbox label="Agrario" {...uiProps("agrario")} />
                <QCheckbox label="Régimen Especial Criterio de Caja (RECC)" {...uiProps("criterioCaja")} />
            </FilaFormulario>
        </>
    );
};
