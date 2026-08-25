import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { QBoton, QModal } from "@olula/componentes/index.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { Cliente } from "../../../comun/componentes/Cliente.tsx";
import {
  cambioClienteVacio,
  metaCambioCliente,
} from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/dominio.ts";
import { PedidoNrj } from "../../diseño.ts";

interface CambioClienteNrjProps {
  onGuardar: (cambios: Partial<PedidoNrj>) => Promise<void>;
  onCancelar: () => void;
}

export const CambioClienteNrj = ({
  onGuardar,
  onCancelar,
}: CambioClienteNrjProps) => {
  const { modelo, uiProps, valido, init } = useModelo(
    metaCambioCliente,
    cambioClienteVacio
  );

  const guardar = async () => {
    await onGuardar({
      cliente_id: modelo.cliente_id,
      direccion_id: modelo.direccion_id,
    } as Partial<PedidoNrj>);
    init(cambioClienteVacio);
  };

  const cancelar = () => {
    onCancelar();
    init(cambioClienteVacio);
  };

  return (
    <QModal
      abierto={true}
      nombre="cambioCliente"
      titulo="Cambiar cliente"
      onCerrar={cancelar}
    >
      <div className="CambioCliente">
        <quimera-formulario>
          <Cliente
            {...uiProps("cliente_id", "nombre_cliente")}
            nombre="cliente_id_cambio"
          />
          <DirCliente
            clienteId={modelo.cliente_id}
            {...uiProps("direccion_id")}
          />
        </quimera-formulario>
        <div className="botones maestro-botones">
          <QBoton onClick={guardar} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
