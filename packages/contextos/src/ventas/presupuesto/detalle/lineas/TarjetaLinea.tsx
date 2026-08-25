import { TarjetaLineaVenta } from "#/ventas/comun/componentes/TarjetaLineaVenta.tsx";
import { LineaPresupuesto as Linea } from "../../diseño.ts";

export const TarjetaLinea = ({
  linea,
  cantidadEditable = false,
  onCambioCantidad,
  divisa,
}: {
  linea: Linea;
  cantidadEditable?: boolean;
  onCambioCantidad?: (linea: Linea, cantidad: number) => void;
  divisa?: string;
}) => (
  <TarjetaLineaVenta
    linea={linea}
    cantidadEditable={cantidadEditable}
    onCambioCantidad={onCambioCantidad}
    divisa={divisa}
  />
);
