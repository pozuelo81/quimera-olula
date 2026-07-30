import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import { useEffect, useState } from "react";
import "./TarjetaLineaVenta.css";

/**
 * Denominador común de las líneas de venta (pedido, presupuesto, albarán,
 * factura). Se deja laxo porque no todos los tipos comparten `dto_lineal`.
 */
export type LineaVentaTarjeta = {
  referencia?: string | null;
  descripcion?: string | null;
  cantidad: number;
  pvp_unitario: number;
  pvp_total: number;
  dto_porcentual?: number | null;
  dto_lineal?: number | null;
  grupo_iva_producto_id?: string | null;
};

/**
 * Tarjeta común para las líneas de documentos de venta
 * (pedido, presupuesto, albarán, factura).
 *
 * Formato:
 *   0001 - Producto X        2 x 10,00€ (5% Dto, 4€ Dto) = 18,00€
 *   IVA 21%
 *
 * - El descuento solo aparece si la línea tiene dto porcentual y/o lineal.
 * - El IVA se muestra en una segunda línea con menor énfasis.
 */
export const TarjetaLineaVenta = <L extends LineaVentaTarjeta>({
  linea,
  cantidadEditable = false,
  onCambioCantidad,
}: {
  linea: L;
  cantidadEditable?: boolean;
  onCambioCantidad?: (linea: L, cantidad: number) => void;
}) => {
  const cantidad = Number(linea.cantidad) || 0;
  const [cantidadInput, setCantidadInput] = useState(String(cantidad));

  const permitirEditarCantidad = cantidadEditable && onCambioCantidad;

  const ivaTexto =
    linea.grupo_iva_producto_id !== null &&
    linea.grupo_iva_producto_id !== undefined &&
    linea.grupo_iva_producto_id !== ""
      ? `IVA ${linea.grupo_iva_producto_id}%`
      : null;

  const partesDto: string[] = [];
  if (linea.dto_porcentual) partesDto.push(`${linea.dto_porcentual}% Dto`);
  if (linea.dto_lineal)
    partesDto.push(`${formatearMoneda(linea.dto_lineal, "EUR")} Dto`);
  const dtoTexto = partesDto.length ? ` (${partesDto.join(", ")})` : "";

  const desglose = `${cantidad} x ${formatearMoneda(
    linea.pvp_unitario,
    "EUR"
  )}${dtoTexto} = ${formatearMoneda(linea.pvp_total, "EUR")}`;

  const titulo = `${linea.referencia ? `${linea.referencia} - ` : ""}${
    linea.descripcion || "Sin descripción"
  }`;

  useEffect(() => {
    setCantidadInput(String(cantidad));
  }, [cantidad]);

  const actualizarCantidad = (nuevaCantidad: number) => {
    if (!permitirEditarCantidad) return;

    const cantidadValida = Math.max(1, Math.floor(nuevaCantidad));
    setCantidadInput(String(cantidadValida));
    if (cantidadValida !== cantidad) {
      onCambioCantidad(linea, cantidadValida);
    }
  };

  const confirmarCantidadInput = (valorRaw?: string) => {
    const valorAValidar = valorRaw ?? cantidadInput;
    const parsed = Number(valorAValidar);
    if (!Number.isFinite(parsed)) {
      setCantidadInput(String(cantidad));
      return;
    }

    actualizarCantidad(parsed);
  };

  return (
    <div className="linea-venta-tarjeta">
      <div className="linea-venta-tarjeta-fila-principal">
        <span className="linea-venta-tarjeta-titulo">{titulo}</span>
        <span className="linea-venta-tarjeta-desglose">{desglose}</span>
      </div>
      {ivaTexto && <div className="linea-venta-tarjeta-iva">{ivaTexto}</div>}

      {permitirEditarCantidad ? (
        <div className="linea-venta-tarjeta-cuerpo">
          <div className="linea-venta-stepper">
            <div className="linea-venta-stepper-control">
              <QBoton
                variante="borde"
                tamaño="pequeño"
                onClick={(e) => {
                  e.stopPropagation();
                  actualizarCantidad(cantidad - 1);
                }}
                props={{ "aria-label": "Disminuir cantidad" }}
              >
                -
              </QBoton>
            </div>

            <div
              className="linea-venta-stepper-input-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <QInput
                label=""
                nombre="cantidad"
                tipo="numero"
                valor={cantidadInput}
                autoSeleccion
                onChange={(valor) => setCantidadInput(valor)}
                onBlur={(valor) => confirmarCantidadInput(valor)}
                onEnterKeyUp={(valor) => confirmarCantidadInput(valor)}
              />
            </div>

            <div className="linea-venta-stepper-control">
              <QBoton
                variante="borde"
                tamaño="pequeño"
                onClick={(e) => {
                  e.stopPropagation();
                  actualizarCantidad(cantidad + 1);
                }}
                props={{ "aria-label": "Aumentar cantidad" }}
              >
                +
              </QBoton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
