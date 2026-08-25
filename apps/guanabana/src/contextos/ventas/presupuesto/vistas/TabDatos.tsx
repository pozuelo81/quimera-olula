import { Agente } from "#/ventas/comun/componentes/agente.tsx";
import { Divisa } from "#/ventas/comun/componentes/divisa.tsx";
import { FormaPago } from "#/ventas/comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "#/ventas/comun/componentes/grupo_iva_negocio.tsx";
import { Presupuesto } from "#/ventas/presupuesto/diseño.ts";
import { grupoIvaNegocioEnDocumento } from "#/ventas/venta/dominio.ts";
import "#/ventas/presupuesto/vistas/TabDatos.css";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";

interface TabDatosProps {
  ctxPresupuesto: HookModelo<Presupuesto>;
  onEntidadActualizada: (entidad: Presupuesto) => void;
}

export const TabDatosGua = ({ ctxPresupuesto }: TabDatosProps) => {
  const { uiProps } = ctxPresupuesto;

  return (
    <>
      <quimera-formulario>
        {"Guanabana!!!"}
        <QDate label="Fecha" {...uiProps("fecha")} />
        <div id="espacio_fecha" />
        <Divisa {...uiProps("divisa_id")} />
        <QInput label="T. Conversión" {...uiProps("tasa_conversion")} />
        <QInput {...uiProps("total_divisa_empresa")} label="Total €" />
        <Agente {...uiProps("agente_id", "nombre_agente")} />
        <div id="espacio_agente" />
        <FormaPago {...uiProps("forma_pago_id", "nombre_forma_pago")} />
        {grupoIvaNegocioEnDocumento() && (
          <GrupoIvaNegocio {...uiProps("grupo_iva_negocio_id")} />
        )}
      </quimera-formulario>
    </>
  );
};
