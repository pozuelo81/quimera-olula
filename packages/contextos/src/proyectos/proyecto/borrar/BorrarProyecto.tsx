import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { Proyecto } from "../diseño.js";
import { deleteProyecto } from "../infraestructura.js";

export const BorrarProyecto = ({
    publicar,
    proyecto,
}: {
    proyecto: Proyecto;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(
        async () => {
            await deleteProyecto(proyecto.id);
            publicar("proyecto_borrado", proyecto);
        },
        [publicar, proyecto]
    );

    const cancelar_ = useCallback(
        () => publicar("borrado_de_proyecto_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarProyecto"
            abierto={true}
            titulo="Borrar proyecto"
            mensaje={`¿Está seguro de que desea borrar el proyecto ${proyecto.nombre}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
