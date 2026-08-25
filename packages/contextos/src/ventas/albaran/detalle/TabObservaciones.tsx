import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Albaran } from "../diseño.ts";
import "./TabObservaciones.css";

interface TabObservacionesProps {
  albaran: HookModelo<Albaran>;
}

export const TabObservaciones = ({ albaran }: TabObservacionesProps) => {
  const { uiProps } = albaran;

  return (
    <div className="TabObservaciones">
      <quimera-formulario>
        <QCheckbox label="Abono" {...uiProps("de_abono")} />
        <QTextArea
          label="Observaciones"
          rows={5}
          {...uiProps("observaciones")}
        />
      </quimera-formulario>
    </div>
  );
};
