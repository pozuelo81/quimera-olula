import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import "./EstadoAlbaran.css";

const PENDIENTE = {
  descripcion: "Pendiente",
  color: "var(--color-exito-oscuro)",
};

const FACTURADO = {
  descripcion: "Facturado",
  color: "var(--color-deshabilitado-oscuro)",
};

export const EstadoAlbaran = ({ facturado }: { facturado: boolean }) => {
  const { descripcion, color } = facturado ? FACTURADO : PENDIENTE;

  return (
    <span className="estado-albaran" title={descripcion}>
      <QIcono nombre="circulo_relleno" tamaño="sm" color={color} />
    </span>
  );
};
