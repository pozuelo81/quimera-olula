import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { formatearDireccionUnaLinea } from "@olula/lib/dominio.ts";
import { useEffect, useRef, useState } from "react";
import { getDirecciones } from "../../cliente/infraestructura.ts";
interface DireccionesProps {
  clienteId: string | undefined;
  valor?: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const DirCliente = ({
  clienteId,
  valor,
  nombre = "direccion_id",
  label = "Dirección",
  deshabilitado = false,
  onChange,
  ...props
}: DireccionesProps) => {
  const [opcionesDireccion, setOpcionesDireccion] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valorRef = useRef(valor);
  valorRef.current = valor;

  useEffect(() => {
    const fetchDirecciones = async () => {
      if (!clienteId) {
        setOpcionesDireccion([]);
        return;
      }

      const direcciones = await getDirecciones(clienteId);
      const opciones = direcciones.map((direccion) => ({
        valor: direccion.id,
        descripcion: formatearDireccionUnaLinea(direccion),
      }));
      setOpcionesDireccion(opciones);

      // Al cambiar de cliente el direccion_id anterior no se limpia, así que
      // solo se respeta si pertenece a este cliente.
      if (opciones.some((o) => o.valor === valorRef.current)) return;

      const facturacion = direcciones.find((d) => d.dir_facturacion);
      if (!facturacion) return;

      onChangeRef.current({
        valor: facturacion.id,
        descripcion: formatearDireccionUnaLinea(facturacion),
      });
    };

    fetchDirecciones();
  }, [clienteId]);

  return (
    <QSelect
      {...props}
      label={label}
      nombre={nombre}
      valor={valor}
      deshabilitado={deshabilitado}
      opciones={opcionesDireccion}
      onChange={onChange}
    />
  );
};
