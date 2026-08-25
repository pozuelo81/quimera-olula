import "./_forminput.css";
import {
  Etiqueta,
  FormInput,
  FormInputProps,
  Validacion,
  useEditando,
} from "./_forminput.tsx";

export type QInputProps = FormInputProps & {
  modificado?: boolean;
  soloLectura?: boolean;
};

export const QInput = ({
  label,
  nombre,
  deshabilitado,
  textoValidacion = "",
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  tipo,
  modificado,
  soloLectura,
  valor,
  ...props
}: QInputProps) => {
  const { editandoHandlers } = useEditando();

  if (soloLectura) {
    return (
      <quimera-input solo-lectura="" nombre={nombre} tipo={tipo} condensado={condensado}>
        <label>
          <Etiqueta label={label} />
          {tipo === "checkbox" ? (
            <input type="checkbox" checked={valor === "true"} disabled readOnly />
          ) : (
            <span className="valor-solo-lectura">{valor || "—"}</span>
          )}
        </label>
      </quimera-input>
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
    tipo,
  };

  const inputAttrs = {
    nombre,
    deshabilitado,
    opcional,
    tipo,
    valor,
    ...props,
  };

  return (
    <quimera-input {...attrs} {...editandoHandlers}>
      <label>
        <Etiqueta label={label} />
        <FormInput {...inputAttrs} />
        <Validacion textoValidacion={textoValidacion} />
      </label>
    </quimera-input>
  );
};
