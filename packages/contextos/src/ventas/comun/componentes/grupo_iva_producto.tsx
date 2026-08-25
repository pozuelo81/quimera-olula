import { QSelect, QSelectProps } from "@olula/componentes/atomos/qselect.tsx";
import { obtenerOpcionesSelector } from "@olula/lib/infraestructura.ts";
import { useEffect, useState } from "react";

type GrupoIvaProductoProps = Omit<QSelectProps, "opciones" | "label" | "nombre">;

export const GrupoIvaProducto = ({
  valor,
  onChange,
  ...props
}: GrupoIvaProductoProps) => {
  const [opciones, setOpciones] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpciones = async () => {
      const opciones = await obtenerOpcionesSelector("grupo_iva_producto")();
      const opcionesMapeadas = opciones.map((opcion) => ({
        valor: opcion[0],
        descripcion: opcion[1],
      }));
      setOpciones(opcionesMapeadas);
    };

    cargarOpciones();
  }, []);

  return (
    <QSelect
      {...props}
      label="Grupo IVA"
      nombre="grupo_iva_producto_id"
      valor={valor}
      onChange={onChange}
      opciones={opciones}
    />
  );
};
