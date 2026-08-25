import { ArticuloLinea } from "#/ventas/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { GrupoIvaProducto } from "@olula/ctx/ventas/comun/componentes/grupo_iva_producto.tsx";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo, useState } from "react";
import { LineaFactura as Linea } from "../diseño.ts";
import "./EditarLinea.css";
import { getModeloInicial, metaLinea, ModeloCambiarLinea } from "./dominio.ts";

export const EditarLinea = ({
  publicar,
  linea,
}: {
  linea: Linea;
  publicar: ProcesarEvento;
}) => {
  const modeloInicial = useMemo(() => getModeloInicial(linea), [linea.id]);

  const { modelo, uiProps, valido, set } = useModelo<ModeloCambiarLinea>(metaLinea, modeloInicial);

  const [cambiando, setCambiando] = useState(false);
  const [mostrarMas, setMostrarMas] = useState(false);

  const cambiar = () => {
    setCambiando(true);
    publicar("linea_actualizada", modelo);
  };

  const cancelar = useCallback(() => {
    if (!cambiando) publicar("editar_linea_cancelado");
  }, [cambiando, publicar]);

  const libre = modelo.tipoArticulo === "libre";

  return (
    <QModal
      abierto={true}
      nombre="editar_linea_factura"
      titulo="Editar línea"
      onCerrar={cancelar}
    >
      <div className="EdicionLinea">
        <quimera-formulario>
          <ArticuloLinea
            tipoArticulo={modelo.tipoArticulo}
            referencia={modelo.referencia}
            descripcionArticulo={modelo.descripcionArticulo}
            descripcion={modelo.descripcion}
            nombre="referencia_cambiar_linea_factura"
            onChange={(cambios) => set({ ...modelo, ...cambios })}
            bloqueado={true}
          />

          <QInput label="Cantidad" {...uiProps("cantidad")} />

          <QInput label="Precio" {...uiProps("pvp_unitario")} />

          <div className="mostrar-mas-fila">
            <button
              type="button"
              className="mostrar-mas-btn"
              onClick={() => setMostrarMas((v) => !v)}
            >
              {mostrarMas ? "▲ Menos opciones" : "▼ Más opciones"}
            </button>
          </div>

          {mostrarMas && (
            <>
              <QInput label="% Descuento" {...uiProps("dto_porcentual")} />
              <QInput label="Dto. lineal" {...uiProps("dto_lineal")} />
              <GrupoIvaProducto {...uiProps("grupo_iva_producto_id")} soloLectura={!libre} />
              <QInput label="% IVA" {...uiProps("tipo_iva")} soloLectura />
              <QInput label="% I.R.P.F." {...uiProps("tipo_irpf")} />
              <QInput label="% Comisión agente" {...uiProps("por_comision")} />
              <QInput label="Importe comisión" {...uiProps("importe_comision")} />
            </>
          )}
        </quimera-formulario>

        <div className="botones maestro-botones ">
          <QBoton onClick={cambiar} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
