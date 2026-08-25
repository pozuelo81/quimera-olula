import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useFocus } from "@olula/lib/useFocus.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { CuentaBanco } from "../../diseño.ts";
import { patchCuentaBanco } from "../../infraestructura.ts";
import { metaCuentaBanco } from "./dominio.ts";
import "./TabCuentasBanco.css";

interface EdicionCuentaBancoProps {
  clienteId: string;
  cuenta: CuentaBanco;
  emitir: (evento: string, payload?: unknown) => void;
}

export const EdicionCuentaBanco = ({
  clienteId,
  cuenta,
  emitir,
}: EdicionCuentaBancoProps) => {
  const { modelo, uiProps, valido } = useModelo(metaCuentaBanco, cuenta);
  const focus = useFocus();

  const guardar = async () => {
    const cuentaActualizada = await patchCuentaBanco(clienteId, modelo);
    emitir("cuenta_actualizada", cuentaActualizada);
  };

  return (
    <div className="EdicionCuentaBanco">
      <quimera-formulario>
        <QInput label="Descripción" {...uiProps("descripcion")} soloLectura />
        <QInput label="IBAN" {...uiProps("iban")} ref={focus} />
        <QInput label="BIC" {...uiProps("bic")} soloLectura />
        <QInput label="Código cuenta" {...uiProps("codigo_cuenta")} soloLectura />
        <QInput label="País" {...uiProps("pais_id")} soloLectura />
        <QInput label="Entidad" {...uiProps("entidad")} soloLectura />
        <QInput label="Agencia" {...uiProps("agencia")} soloLectura />
        <QInput label="Dígito control" {...uiProps("digito_control")} soloLectura />
        <QInput label="Cuenta" {...uiProps("cuenta")} soloLectura />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!valido}>
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => emitir("edicion_cancelada")}
        >
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
