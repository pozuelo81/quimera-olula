import { PaisSelector } from "#/comun/componentes/pais/pais.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { UiProps } from "@olula/lib/useModelo.ts";
import "./CamposDireccionVenta.css";

/**
 * Campos de dirección en snake_case, compartidos por el alta de documento de
 * venta con cliente no registrado y por el cambio de cliente del detalle.
 *
 * Devuelve un fragmento: tiene que ser hijo directo de `quimera-formulario`
 * para que las columnas del grid apliquen. El contenedor del formulario debe
 * llevar la clase `campos-direccion`.
 */
export const CamposDireccionVenta = ({
  uiProps,
}: {
  uiProps: (campo: string, secundario?: string) => UiProps;
}) => (
  <>
    <QInput label="Tipo de Vía" {...uiProps("tipo_via")} />
    <QInput label="Nombre de la Vía" {...uiProps("nombre_via")} />
    <QInput label="Número" {...uiProps("numero")} />
    <QInput label="Otros" {...uiProps("otros")} />
    <QInput label="Cód. Postal" {...uiProps("cod_postal")} />
    <QInput label="Ciudad" {...uiProps("ciudad")} />
    <QInput label="Provincia" {...uiProps("provincia")} />
    <PaisSelector label="País" {...uiProps("pais_id")} />
    <QInput label="Teléfono" {...uiProps("telefono")} />
  </>
);
