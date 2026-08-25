import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Filtro } from "@olula/lib/diseño.ts";
import { getClientes } from "../../cliente/infraestructura.ts";

interface ClienteProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  opcional?: boolean;
  enlace?: string;
  ref?: React.RefObject<HTMLInputElement | null>;
  onChange?: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Cliente = ({
  descripcion = "",
  valor,
  nombre = "cliente_id",
  label = "Cliente",
  deshabilitado = false,
  enlace = "/ventas/cliente?id={id}",
  onChange,
  ...props
}: ClienteProps) => {
  const clienteRegistrado = !!valor && valor !== "None";

  const obtenerOpciones = async (texto: string, id?: string) => {
    const criteria = {
      filtro: id ? [["id", "=", id]] : ["nombre", "~", texto],
      orden: ["id"],
    };

    const { datos } = await getClientes(
      criteria.filtro as unknown as Filtro,
      criteria.orden,
      { pagina: 1, limite: 10 }
    );

    if (!Array.isArray(datos)) {
      return [];
    }

    return datos.map((cliente) => ({
      valor: cliente.id,
      descripcion: cliente.nombre,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      obtenerOpciones={obtenerOpciones}
      enlace={clienteRegistrado ? enlace : undefined}
      descripcion={descripcion}
      soloLectura={deshabilitado}
      {...props}
    />
  );
};
