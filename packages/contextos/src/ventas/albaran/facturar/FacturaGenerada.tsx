import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { FacturaCreada } from "../diseño.ts";

type UrlPorId = (id: string) => string;

export const FacturaGenerada = ({
    publicar,
    factura,
}: {
    publicar: EmitirEvento;
    factura: FacturaCreada;
}) => {
    const navigate = useNavigate();
    const { app } = useContext(FactoryCtx);
    const urlFactura =
        (app.Ventas?.albaran_url_factura as UrlPorId | undefined) ??
        ((id: string) => `/ventas/factura?id=${id}`);

    const cerrar = () => publicar("factura_creada_cerrada");

    return (
        <QModal
            nombre="facturaGenerada"
            abierto={true}
            titulo="Factura generada"
            onCerrar={cerrar}
        >
            <div className="mensaje" style={{ whiteSpace: "pre-line" }}>
                La factura se ha generado correctamente.
            </div>
            <div className="botones">
                <QBoton variante="texto" onClick={cerrar}>
                    Seguir en el albarán
                </QBoton>
                <QBoton onClick={() => navigate(urlFactura(factura.id))}>
                    Ir a la factura {factura.codigo}
                </QBoton>
            </div>
        </QModal>
    );
};
