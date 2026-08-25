import { CamposDireccionVenta } from "#/ventas/comun/componentes/CamposDireccionVenta.tsx";
import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import {
  metaNuevaVentaClienteNoRegistrado,
  nuevaVentaClienteNoRegistradaVacia,
} from "#/ventas/venta/dominio.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useFocus } from "@olula/lib/useFocus.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useState } from "react";
import { metaNuevoAlbaran, nuevoAlbaranVacio } from "../dominio.ts";
import { getAlbaran, postAlbaran } from "../infraestructura.ts";
import "./CrearAlbaran.css";

export const CrearAlbaran = ({
  publicar = async () => {},
}: {
  publicar?: EmitirEvento;
}) => {
  const [modoNoRegistrado, setModoNoRegistrado] = useState(false);
  const albaranRegistrado = useModelo(metaNuevoAlbaran, nuevoAlbaranVacio);
  const albaranNoRegistrado = useModelo(
    metaNuevaVentaClienteNoRegistrado,
    nuevaVentaClienteNoRegistradaVacia
  );
  const focus = useFocus();

  /* El maestro monta el modal siempre, así que el modo no se reinicia solo. */
  const reiniciar = useCallback(() => {
    albaranRegistrado.init(nuevoAlbaranVacio);
    albaranNoRegistrado.init(nuevaVentaClienteNoRegistradaVacia);
    setModoNoRegistrado(false);
  }, [albaranRegistrado, albaranNoRegistrado]);

  const guardar_ = useCallback(async () => {
    const modelo = modoNoRegistrado
      ? albaranNoRegistrado.modelo
      : albaranRegistrado.modelo;

    const id = await postAlbaran(modelo);
    const albaranCreado = await getAlbaran(id);
    publicar("albaran_creado", albaranCreado);

    reiniciar();
  }, [
    modoNoRegistrado,
    albaranNoRegistrado.modelo,
    albaranRegistrado.modelo,
    publicar,
    reiniciar,
  ]);

  const cancelar_ = useCallback(() => {
    publicar("creacion_cancelada");
    reiniciar();
  }, [publicar, reiniciar]);

  const [guardar, cancelar] = useForm(guardar_, cancelar_);

  const toggleModoCliente = () => {
    setModoNoRegistrado(!modoNoRegistrado);
    albaranRegistrado.init(nuevoAlbaranVacio);
    albaranNoRegistrado.init(nuevaVentaClienteNoRegistradaVacia);
  };

  return (
    <>
      <div className="modo-cliente">
        <QBoton onClick={toggleModoCliente} variante="texto" tipo="button">
          {modoNoRegistrado ? "Cliente registrado" : "Cliente no registrado"}
        </QBoton>
      </div>
      <div className="CrearAlbaran campos-direccion">
        <quimera-formulario>
          {modoNoRegistrado ? (
            <>
              <QInput
                label="Nombre del Cliente"
                {...albaranNoRegistrado.uiProps("nombre_cliente")}
                ref={focus}
              />
              <QInput
                label="ID Fiscal"
                {...albaranNoRegistrado.uiProps("id_fiscal")}
              />
              <CamposDireccionVenta uiProps={albaranNoRegistrado.uiProps} />
            </>
          ) : (
            <>
              <Cliente
                {...albaranRegistrado.uiProps("cliente_id", "nombre")}
                nombre="albaran_cliente_id"
                ref={focus}
              />
              <DirCliente
                clienteId={albaranRegistrado.modelo.cliente_id}
                {...albaranRegistrado.uiProps("direccion_id")}
              />
            </>
          )}
        </quimera-formulario>
      </div>
      <div className="botones">
        <QBoton
          onClick={guardar}
          deshabilitado={
            modoNoRegistrado
              ? !albaranNoRegistrado.valido
              : !albaranRegistrado.valido
          }
        >
          Guardar
        </QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </>
  );
};
