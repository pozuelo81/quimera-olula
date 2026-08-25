import { capitalizarDescripcion } from "#/ventas/comun/dominio.ts";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { obtenerDatosSelector } from "@olula/lib/infraestructura.ts";
import { useEffect, useState } from "react";

interface GrupoIvaNegocioProps {
  valor: string;
  label?: string;
  nombre?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const GrupoIvaNegocio = ({
  valor,
  label = "Grupo IVA negocio",
  nombre = "grupo_iva_negocio_id",
  onChange,
  ...props
}: GrupoIvaNegocioProps) => {
  const [opciones, setOpciones] = useState<
    { valor: string; descripcion: string }[]
  >([]);

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

  return (
    <QSelect
      {...props}
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opciones}
    />
  );
};
