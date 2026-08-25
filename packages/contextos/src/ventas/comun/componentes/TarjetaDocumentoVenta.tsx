import { QAvatar, QTarjetaGenerica } from "@olula/componentes/index.js";
import { formatearFechaDate, formatearMoneda } from "@olula/lib/dominio.ts";
import { ReactNode } from "react";
import { DIVISA_EMPRESA, enDivisaExtranjera } from "../../venta/dominio.ts";
import "./TarjetaDocumentoVenta.css";

export type EstadoDocumento = "cerrado" | "parcial" | "pendiente";

export const TarjetaDocumentoVenta = ({
  codigo,
  nombreCliente,
  fecha,
  total,
  estado,
  divisa = "EUR",
  tasaConversion,
  totalDivisaEmpresa,
  etiqueta,
}: {
  codigo: string;
  nombreCliente: string;
  fecha: Date;
  total: number;
  estado: EstadoDocumento;
  divisa?: string;
  tasaConversion?: number;
  totalDivisaEmpresa?: number;
  etiqueta?: ReactNode;
}) => {
  const mostrarContravalor =
    enDivisaExtranjera({ divisa_id: divisa }) &&
    totalDivisaEmpresa !== undefined &&
    tasaConversion !== undefined;

  return (
    <QTarjetaGenerica
      avatar={
        <QAvatar
          nombre={nombreCliente || codigo}
          className={`tarjeta-doc-avatar estado-${estado}`}
        />
      }
      arribaIzquierda={
        <span className="tarjeta-doc-titulo">
          {codigo}
          {nombreCliente ? ` · ${nombreCliente}` : ""}
          {etiqueta}
        </span>
      }
      abajoIzquierda={fecha ? formatearFechaDate(new Date(fecha)) : ""}
      abajoDerecha={
        <span className="tarjeta-doc-importes">
          <span className="tarjeta-doc-total">
            {formatearMoneda(total, divisa)}
          </span>
          {mostrarContravalor && (
            <span className="tarjeta-doc-contravalor">
              {formatearMoneda(totalDivisaEmpresa, DIVISA_EMPRESA)}
            </span>
          )}
        </span>
      }
    />
  );
};
