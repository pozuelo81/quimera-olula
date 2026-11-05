import { capitalizarDescripcion } from "#/ventas/comun/dominio.ts";
import { obtenerDatosSelector } from "@olula/lib/infraestructura.ts";
import { useEffect, useState } from "react";

export type OpcionGrupoIvaNegocio = { valor: string; descripcion: string };

/** Grupos de IVA de negocio (caché del servidor) con la descripción ya capitalizada. */
export const useOpcionesGrupoIvaNegocio = (): OpcionGrupoIvaNegocio[] => {
  const [opciones, setOpciones] = useState<OpcionGrupoIvaNegocio[]>([]);

  useEffect(() => {
    const cargarOpciones = async () => {
      const datos = await obtenerDatosSelector("grupo_iva_negocio")();
      setOpciones(
        datos.map((grupo) => ({
          valor: String(grupo.id ?? ""),
          descripcion: capitalizarDescripcion(String(grupo.descripcion ?? "")),
        }))
      );
    };

    cargarOpciones();
  }, []);

  return opciones;
};
