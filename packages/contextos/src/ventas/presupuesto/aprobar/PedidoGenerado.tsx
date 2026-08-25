import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { PedidoCreado } from "../diseño.ts";

type UrlPorId = (id: string) => string;

export const PedidoGenerado = ({
    publicar,
    pedido,
}: {
    publicar: EmitirEvento;
    pedido: PedidoCreado;
}) => {
    const navigate = useNavigate();
    const { app } = useContext(FactoryCtx);
    const urlPedido =
        (app.Ventas?.presupuesto_url_pedido as UrlPorId | undefined) ??
        ((id: string) => `/ventas/pedido?id=${id}`);

    const cerrar = () => publicar("pedido_creado_cerrado");

    return (
        <QModal
            nombre="pedidoGenerado"
            abierto={true}
            titulo="Pedido generado"
            onCerrar={cerrar}
        >
            <div className="mensaje" style={{ whiteSpace: "pre-line" }}>
                El pedido se ha generado correctamente.
            </div>
            <div className="botones">
                <QBoton variante="texto" onClick={cerrar}>
                    Seguir en el presupuesto
                </QBoton>
                <QBoton onClick={() => navigate(urlPedido(pedido.id))}>
                    Ir al pedido {pedido.codigo}
                </QBoton>
            </div>
        </QModal>
    );
};
