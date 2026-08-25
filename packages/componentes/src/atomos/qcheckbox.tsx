import "./_forminput.css";
import {
  Etiqueta,
  FormInput,
  FormInputProps,
  Validacion,
} from "./_forminput.tsx";
import "./qcheckbox.css";

export type QCheckboxProps = Omit<FormInputProps, "valor" | "onChange"> & {
  valor: boolean | string;
  soloLectura?: boolean;
  modificado?: boolean;
  onChange?: (valor: string, evento: React.ChangeEvent<HTMLInputElement>) => void;
};

export const QCheckbox = ({
  label,
  nombre,
  deshabilitado,
  textoValidacion = "",
  valor = false,
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  soloLectura,
  modificado,
  onChange,
  ...props
}: QCheckboxProps) => {
  // Convertir valor a boolean si viene como string
  const valorBoolean =
    typeof valor === "string" ? valor === "true" || valor === "1" : valor;

  if (soloLectura) {
    return (
      <quimera-checkbox solo-lectura="" nombre={nombre} condensado={condensado}>
        <label>
          <input type="checkbox" checked={valorBoolean} disabled readOnly />
          <Etiqueta label={label} />
        </label>
      </quimera-checkbox>
    );
  }

  const attrs = {
    nombre,
    erroneo,
    advertido,
    valido,
    opcional,
    condensado,
    deshabilitado,
    modificado,
  };

  const manejarChange = (
    _valor: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange?.(e.target.checked.toString(), e);
  };

  const inputAttrs = {
    nombre,
    deshabilitado,
    opcional,
    checked: valorBoolean,
    tipo: "checkbox" as const,
    onChange: onChange ? manejarChange : undefined,
    ...props,
  };

  return (
    <quimera-checkbox {...attrs}>
      <label>
        <FormInput {...inputAttrs} />
        <Etiqueta label={label} />
        <Validacion textoValidacion={textoValidacion} />
      </label>
    </quimera-checkbox>
  );
};
