import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";

export const AprobarPresupuesto = ({
  publicar,
}: {
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const aprobar = async () => {
    publicar("aprobacion_lista");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarAprobarPresupuesto"
      abierto={true}
      titulo="Confirmar aprobación"
      mensaje="¿Está seguro de que desea aprobar este presupuesto?"
      onCerrar={() => publicar("aprobacion_cancelada")}
      onAceptar={aprobar}
    />
  );
};
