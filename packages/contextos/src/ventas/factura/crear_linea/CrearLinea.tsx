import { ArticuloLinea } from "#/ventas/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback } from "react";
import "./CrearLinea.css";
import { metaNuevaLinea, nuevaLineaVacia, postModelo } from "./dominio.ts";

export const CrearLinea = ({
  facturaId,
  publicar,
}: {
  facturaId: string;
  publicar: ProcesarEvento;
}) => {
  const { modelo, uiProps, valido, set } = useModelo(metaNuevaLinea, nuevaLineaVacia);

  const crear_ = useCallback(async () => {
    await postModelo(facturaId, modelo);
    publicar("linea_creada");
  }, [facturaId, modelo, publicar]);

  const cancelar_ = useCallback(
    () => publicar("crear_linea_cancelado"),
    [publicar]
  );

  const [crear, cancelar] = useForm(crear_, cancelar_);

  return (
    <QModal
      abierto={true}
      nombre="crear_linea_factura"
      titulo="Crear línea"
      onCerrar={cancelar}
    >
      <div className="CrearLinea">
        <quimera-formulario>
          <ArticuloLinea
            tipoArticulo={modelo.tipoArticulo}
            referencia={modelo.referencia}
            descripcionArticulo={modelo.descripcionArticulo}
            descripcion={modelo.descripcion ?? ""}
            nombre="referencia_nueva_linea_factura"
            onChange={(cambios) => set({ ...modelo, ...cambios })}
          />
          <QInput label="Cantidad" {...uiProps("cantidad")} />
          {modelo.tipoArticulo === "libre" && (
            <QInput
              label="PVP unitario"
              {...uiProps("pvp_unitario")}
            />
          )}
        </quimera-formulario>
        <div className="botones maestro-botones ">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Crear
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
