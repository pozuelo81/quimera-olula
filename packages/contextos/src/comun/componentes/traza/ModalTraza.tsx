import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GetTraza, GrafoTraza as Grafo, UrlsTraza } from "./diseño.ts";
import { grafoDesdeTraza, urlDocumento } from "./dominio.ts";
import { GrafoTraza } from "./GrafoTraza.tsx";
import { PanelDocumentoTraza } from "./PanelDocumentoTraza.tsx";
import "./traza.css";

/**
 * Documentos relacionados con el que está abierto: de dónde viene y qué se ha
 * generado a partir de él. `getTraza` es la del módulo del documento
 * (p. ej. `getTrazaFactura`); tiene que ser estable entre renders.
 */
export const ModalTraza = ({
  id,
  getTraza,
  onCerrar,
}: {
  id: string;
  getTraza: GetTraza;
  onCerrar: () => void;
}) => {
  const navigate = useNavigate();
  const { app } = useContext(FactoryCtx);
  const urls = (app.Comun?.traza_urls ?? {}) as UrlsTraza;

  const [grafo, setGrafo] = useState<Grafo | null>(null);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vigente = true;
    getTraza(id)
      .then((respuesta) => {
        if (!vigente) return;
        const nuevo = grafoDesdeTraza(respuesta);
        setGrafo(nuevo);
        setSeleccionado(nuevo.raiz);
      })
      .catch(() => vigente && setError(true));
    return () => {
      vigente = false;
    };
  }, [getTraza, id]);

  const nodo = grafo?.nodos.find((candidato) => candidato.clave === seleccionado);

  const ver = (url: string) => {
    onCerrar();
    navigate(url);
  };

  return (
    <QModal nombre="trazaDocumentos" abierto={true} titulo="Documentos relacionados" onCerrar={onCerrar}>
      <div className="traza-documentos">
        {error && <p className="traza-mensaje">No se han podido cargar los documentos relacionados.</p>}
        {!error && !grafo && <p className="traza-mensaje">Cargando documentos relacionados…</p>}
        {grafo && nodo && (
          <>
            <GrafoTraza grafo={grafo} seleccionado={nodo.clave} onSeleccionar={setSeleccionado} />
            <PanelDocumentoTraza
              nodo={nodo}
              esRaiz={nodo.clave === grafo.raiz}
              url={urlDocumento(nodo.datos.tipo, nodo.datos.id, urls)}
              onVer={ver}
            />
          </>
        )}
      </div>
    </QModal>
  );
};
