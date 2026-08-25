import { ArticuloLinea } from "#/ventas/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import "./CrearLinea.css";
import { metaNuevaLinea, nuevaLineaVacia, postModelo } from "./dominio.ts";

export const CrearLinea = ({
  albaranId,
  publicar,
}: {
  albaranId: string;
  publicar: ProcesarEvento;
}) => {
  const lineaArticulo = useModelo(metaNuevaLinea, nuevaLineaVacia);
  const linea = lineaArticulo.modelo;

  const crear_ = useCallback(async () => {
    await postModelo(albaranId, linea);
    publicar("alta_linea_lista");
  }, [linea, albaranId, publicar]);

  const cancelar_ = useCallback(
    () => publicar("crear_linea_cancelado"),
    [publicar]
  );

  const [crear, cancelar] = useForm(crear_, cancelar_);

  return (
    <QModal
      abierto={true}
      nombre="crear_linea_albaran"
      titulo="Crear línea"
      onCerrar={cancelar}
    >
      <div className="CrearLinea">
        <quimera-formulario>
          <ArticuloLinea
            tipoArticulo={linea.tipoArticulo}
            referencia={linea.referencia}
            descripcionArticulo={linea.descripcionArticulo}
            descripcion={linea.descripcion ?? ""}
            nombre="referencia_nueva_linea_albaran"
            onChange={(cambios) => lineaArticulo.set({ ...linea, ...cambios })}
          />
          <QInput label="Cantidad" {...lineaArticulo.uiProps("cantidad")} />
          {linea.tipoArticulo === "libre" && (
            <QInput
              label="PVP unitario"
              {...lineaArticulo.uiProps("pvp_unitario")}
            />
          )}
        </quimera-formulario>
        <div className="botones maestro-botones ">
          <QBoton onClick={crear} deshabilitado={!lineaArticulo.valido}>
            Crear
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
