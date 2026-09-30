import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { NodoTraza } from "./diseño.ts";
import { etiquetaNodo, nombreTipo, resumenDocumento } from "./dominio.ts";

export const PanelDocumentoTraza = ({
  nodo,
  esRaiz,
  url,
  onVer,
}: {
  nodo: NodoTraza;
  esRaiz: boolean;
  url: string | null;
  onVer: (url: string) => void;
}) => {
  const { datos } = nodo;
  const resumen = resumenDocumento(datos);
  const destino = !esRaiz && datos.visible ? url : null;

  return (
    <section className="traza-panel" aria-live="polite">
      <header>
        <span className="traza-panel-tipo">{nombreTipo(datos.tipo)}</span>
        <strong className="traza-panel-codigo">{etiquetaNodo(datos)}</strong>
      </header>

      {datos.visible ? (
        <dl>
          {resumen.map(({ etiqueta, valor }) => (
            <div key={etiqueta}>
              <dt>{etiqueta}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="traza-panel-aviso">No tienes acceso a los datos de este documento.</p>
      )}

      <div className="botones">
        <QBoton
          variante="borde"
          deshabilitado={!destino}
          props={{ disabled: !destino }}
          onClick={() => destino && onVer(destino)}
        >
          {esRaiz ? "Documento actual" : "Ver documento"}
        </QBoton>
      </div>
    </section>
  );
};
