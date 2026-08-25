import { formatearMoneda } from "@olula/lib/dominio.ts";
import { Venta } from "../diseño.ts";
import { DIVISA_EMPRESA, enDivisaExtranjera } from "../dominio.ts";
import "./TotalDivisaEmpresa.css";

export const TotalDivisaEmpresa = ({ venta }: { venta: Venta }) => {
  if (!enDivisaExtranjera(venta)) return null;

  return (
    <div className="total-divisa-empresa">
      <span>{`Total en ${DIVISA_EMPRESA}:`}</span>
      <strong>
        {formatearMoneda(venta.total_divisa_empresa, DIVISA_EMPRESA)}
      </strong>
    </div>
  );
};
