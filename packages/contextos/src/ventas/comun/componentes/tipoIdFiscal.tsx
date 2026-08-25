import { QSelect, QSelectProps } from "@olula/componentes/atomos/qselect.tsx";
import { opcionesTipoIdFiscal } from "../../../valores/idfiscal.ts";

type TipoIdFiscalProps = Omit<QSelectProps, "opciones" | "label" | "nombre"> & {
  valor: string;
  label?: string;
  nombre?: string;
};

export const TipoIdFiscal = ({
  valor,
  label = "Tipo Id Fiscal",
  nombre = "tipo_id_fiscal",
  ...props
}: TipoIdFiscalProps) => {
  return (
    <QSelect
      {...props}
      label={label}
      nombre={nombre}
      valor={valor}
      opciones={opcionesTipoIdFiscal}
    />
  );
};
