import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import "./EstadoPresupuesto.css";

const PENDIENTE = {
  descripcion: "Pendiente",
  color: "var(--color-exito-oscuro)",
};

const APROBADO = {
  descripcion: "Aprobado",
  color: "var(--color-deshabilitado-oscuro)",
};

export const EstadoPresupuesto = ({ aprobado }: { aprobado: boolean }) => {
  const { descripcion, color } = aprobado ? APROBADO : PENDIENTE;

  return (
    <span className="estado-presupuesto" title={descripcion}>
      <QIcono nombre="circulo_relleno" tamaño="sm" color={color} />
    </span>
  );
};
