import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";

export const AlbaranarPedidos = ({
    publicar,
    pedidos,
    grupos,
}: {
    publicar: EmitirEvento;
    pedidos: number;
    grupos: number;
}) => {
    const albaranar_ = useCallback(async () => {
        publicar("pedidos_albaranados");
    }, [publicar]);

    const cancelar_ = useCallback(() => publicar("albaranado_multiple_cancelado"), [publicar]);

    const [albaranar, cancelar] = useForm(albaranar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="albaranarPedidos"
            abierto={true}
            titulo="Albaranar pedidos"
            mensaje={
                grupos === 1
                    ? `¿Albaranar los ${pedidos} pedidos seleccionados? Se generará 1 albarán.`
                    : `¿Albaranar los ${pedidos} pedidos seleccionados? Se generarán ${grupos} albaranes (uno por cliente).`
            }
            onCerrar={cancelar}
            onAceptar={albaranar}
        />
    );
};
