import { metaTablaLineaVentaResumida } from "#/ventas/venta/vistas/metatabla_linea_venta.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.ts";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.js";
import { useContext } from "react";
import { LineaPedido as Linea } from "../../diseño.ts";
import { EditarCantidadLinea } from "./EditarCantidadLinea.tsx";
import { TarjetaLinea } from "./TarjetaLinea.tsx";

export type LineasListaProps<L extends Linea = Linea> = {
  lineas: L[];
  seleccionada?: string;
  onCambioCantidad?: (linea: L, cantidad: number) => void;
  pedidoEditable?: boolean;
  cantidadEditable?: boolean;
  divisa?: string;
  acciones?: Parameters<typeof QuimeraAcciones>[0]["acciones"];
  publicar: (evento: string, payload?: unknown) => void;
};

export const LineasLista = (props: LineasListaProps) => {
  const { app } = useContext(FactoryCtx);
  const LineasLista_ = app.Ventas
    .pedido_detalle_lineas_LineasLista as typeof LineasListaBase;

  return LineasLista_(props);
};

export const LineasListaBase = ({
  lineas,
  seleccionada,
  onCambioCantidad,
  pedidoEditable,
  cantidadEditable = false,
  divisa,
  acciones,
  publicar,
}: LineasListaProps) => {
  const esMovil = useEsMovil();

  const setSeleccionada = (linea: Linea) => {
    if (!pedidoEditable) return;
    publicar("linea_seleccionada", linea);
  };

  return (
    <ListadoSemiControlado
      metaTabla={metaTablaLineaVentaResumida<Linea>({
        divisa,
        renderCantidad:
          cantidadEditable && onCambioCantidad
            ? (linea) => (
                <EditarCantidadLinea
                  linea={linea}
                  onCantidadEditada={onCambioCantidad}
                />
              )
            : undefined,
      })}
      tarjeta={(linea) => (
        <TarjetaLinea
          linea={linea}
          cantidadEditable={cantidadEditable}
          onCambioCantidad={onCambioCantidad}
          divisa={divisa}
        />
      )}
      entidades={lineas}
      totalEntidades={lineas.length}
      seleccionada={lineas.find((linea) => linea.id === seleccionada) ?? null}
      onSeleccion={setSeleccionada}
      criteriaInicial={criteriaLineasDefecto}
      modoInicial={esMovil ? "tarjetas" : "tabla"}
      onCriteriaChanged={(_: Criteria) => null}
      renderAcciones={() =>
        acciones && acciones.length > 0 ? (
          <div className="botones maestro-botones ">
            <QuimeraAcciones acciones={acciones} />
          </div>
        ) : null
      }
    />
  );
};

export const criteriaLineasDefecto: Criteria = {
  ...criteriaDefecto,
  orden: ["linea", "ASC"],
};
