import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { Ejercicio } from "../diseño.ts";
import { etiquetaEjercicio } from "../dominio.ts";
import { patchDeshacerCierre } from "../infraestructura.ts";

export const DeshacerCierreEjercicio = ({
    ejercicio,
    publicar,
}: {
    ejercicio: Ejercicio;
    publicar: EmitirEvento;
}) => {
    const aceptar_ = useCallback(async () => {
        await patchDeshacerCierre(ejercicio.id);
        publicar("cierre_deshecho");
    }, [ejercicio.id, publicar]);
    const [aceptar, cancelar] = useForm(aceptar_, () => publicar("cancelado"));

    return (
        <QModalConfirmacion
            nombre="deshacerCierre"
            abierto={true}
            titulo="Deshacer el cierre"
            mensaje={`Se borrarán los asientos de pérdidas y ganancias, de cierre y la apertura del ejercicio siguiente, y ${etiquetaEjercicio(ejercicio)} quedará abierto. ¿Continuar?`}
            onCerrar={cancelar}
            onAceptar={aceptar}
        />
    );
};
