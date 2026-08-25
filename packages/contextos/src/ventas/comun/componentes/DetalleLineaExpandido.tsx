import {
  desgloseLineaVenta,
  fiscalidadLineaVenta,
  type LineaVentaTarjeta,
} from "./linea_venta_texto.ts";
import "./DetalleLineaExpandido.css";

export const DetalleLineaExpandido = ({
  linea,
  divisa,
}: {
  linea: LineaVentaTarjeta;
  divisa?: string;
}) => {
  const desglose = desgloseLineaVenta(linea, divisa);
  const fiscalidad = fiscalidadLineaVenta(linea, divisa);

  return (
    <div className="DetalleLineaExpandido">
      <div className="detalle-linea-campo">
        <span className="detalle-linea-etiqueta">Desglose</span>
        <span>{desglose}</span>
      </div>
      <div className="detalle-linea-campo">
        <span className="detalle-linea-etiqueta">Impuestos y comisión</span>
        <span>{fiscalidad || "—"}</span>
      </div>
    </div>
  );
};
