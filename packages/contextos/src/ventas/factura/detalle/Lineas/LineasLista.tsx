import { metaTablaLineaVentaResumida } from "#/ventas/venta/vistas/metatabla_linea_venta.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.ts";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { LineaFactura as Linea } from "../../diseño.ts";
import { EditarCantidadLinea } from "./EditarCantidadLinea.tsx";
import { TarjetaLinea } from "./TarjetaLinea.tsx";

export const LineasLista = ({
  lineas,
  seleccionada,
  onCambioCantidad,
  facturaEditable,
  cantidadEditable = false,
  divisa,
  acciones,
  publicar,
}: {
  lineas: Linea[];
  seleccionada?: string;
  onCambioCantidad?: (linea: Linea, cantidad: number) => void;
  facturaEditable?: boolean;
  cantidadEditable?: boolean;
  divisa?: string;
  acciones?: Parameters<typeof QuimeraAcciones>[0]["acciones"];
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const esMovil = useEsMovil();

  const setSeleccionada = (linea: Linea) => {
    if (!facturaEditable) return;
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
      cargando={false}
      seleccionada={lineas.find((linea) => linea.id === seleccionada) ?? null}
      onSeleccion={setSeleccionada}
      criteriaInicial={criteriaDefecto}
      modoInicial={esMovil ? "tarjetas" : "tabla"}
      onCriteriaChanged={() => null}
      renderAcciones={() =>
        facturaEditable && acciones && acciones.length > 0 ? (
          <div className="botones maestro-botones ">
            <QuimeraAcciones acciones={acciones} />
          </div>
        ) : null
      }
    />
  );
};
