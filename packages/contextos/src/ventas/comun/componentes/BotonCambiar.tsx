import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import "./BotonCambiar.css";

interface BotonCambiarProps {
  titulo: string;
  onClick: () => void;
  deshabilitado?: boolean;
}

export const BotonCambiar = ({
  titulo,
  onClick,
  deshabilitado = false,
}: BotonCambiarProps) => (
  <button
    type="button"
    className="BotonCambiar"
    onClick={onClick}
    disabled={deshabilitado}
    title={titulo}
    aria-label={titulo}
  >
    <QIcono nombre="editar_2" tamaño="sm" />
  </button>
);
