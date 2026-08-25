import { Entidad } from "@olula/lib/diseño.ts";
import { PropsWithChildren, ReactNode, useEffect } from "react";
import { QBoton } from "../atomos/qboton.tsx";
import { QIcono } from "../atomos/qicono.tsx";
import "./detalle.css";

interface DetalleProps<T extends Entidad> {
  id: string | undefined;
  obtenerTitulo?: (entidad: T) => ReactNode;
  entidad: T | null;
  setEntidad: (entidad: T) => void;
  cargar?: (id: string) => Promise<T>;
  className?: string;
  cerrarDetalle?: () => void;
}

export function Detalle<T extends Entidad>({
  id,
  obtenerTitulo,
  children,
  entidad,
  setEntidad,
  cargar,
  className,
  cerrarDetalle,
}: PropsWithChildren<DetalleProps<T>>) {
  useEffect(() => {
    if (cargar && id && (!entidad || id !== entidad.id)) {
      const load = async () => {
        const cliente = await cargar(id);
        if (cliente) {
          setEntidad(cliente);
        }
      };
      load();
    }
  }, [id, entidad, cargar, setEntidad]);

  if (!entidad) {
    return <>No se ha encontrado la entidad con Id: {id}</>;
  }

  if (!id) {
    return <></>;
  }

  return (
    <div className={`detalle ${className || ""}`.trim()}>
      {" "}
      {obtenerTitulo && (
        <div className="detalle-cabecera">
          <h2>{obtenerTitulo(entidad)}</h2>
          {cerrarDetalle && (
            <QBoton
              onClick={cerrarDetalle}
              variante="texto"
              tamaño="pequeño"
              destructivo
            >
              <QIcono nombre="cerrar" tamaño="sm" />
            </QBoton>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
