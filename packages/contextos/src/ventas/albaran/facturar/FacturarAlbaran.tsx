import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { Albaran } from "../diseño.ts";

export const FacturarAlbaran = ({
    publicar,
    albaran,
}: {
    publicar: EmitirEvento;
    albaran: Albaran;
}) => {
    const facturar_ = useCallback(async () => {
        publicar("facturacion_lista");
    }, [publicar]);

    const cancelar_ = useCallback(() => publicar("facturar_cancelado"), [publicar]);

    const [facturar, cancelar] = useForm(facturar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="facturarAlbaran"
            abierto={true}
            titulo="Facturar albarán"
            mensaje={`¿Seguro que desea facturar el albarán ${albaran.codigo}?`}
            onCerrar={cancelar}
            onAceptar={facturar}
        />
    );
};
