import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QuimeraAcciones } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useEffect } from "react";
import { BorrarProyecto } from "../borrar/BorrarProyecto.js";
import { Proyecto } from "../diseño.js";
import { contextoDetalleProyectoInicial, guardarProyecto, metaProyecto } from "./detalle.js";
import "./DetalleProyecto.css";
import { getMaquina } from "./maquina.js";
import { TabGeneral } from "./TabGeneral.js";

export const DetalleProyecto = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoDetalleProyectoInicial,
        publicar
    );

    const autoGuardar = useCallback(
        async (proyecto: Proyecto) => {
            await guardarProyecto(ctx, proyecto);
            await emitir("proyecto_guardado");
        },
        [ctx, emitir]
    );

    const formModelo = useModelo(metaProyecto, ctx.proyecto, autoGuardar);

    const { estado, proyecto } = ctx;

    useEffect(() => {
        emitir("proyecto_id_cambiado", id, true);
    }, [id]);

    if (!ctx.proyecto.id) return null;

    const titulo = (p: Proyecto) => p.nombreCompleto

    const accionesProyecto = [
        {
            texto: "Borrar",
            onClick: () => emitir("borrado_solicitado"),
            advertencia: true,
        },
    ];

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={ctx.proyecto}
            cerrarDetalle={() => emitir("proyecto_deseleccionado", null, true)}
        >
            <div className="DetalleProyecto">
                <QuimeraAcciones acciones={accionesProyecto} />
                <Tabs children={[
                    <Tab label="General" key="tab-general"
                        children={<TabGeneral form={formModelo} />}
                    />,
                ]} />
            </div>

            {estado === "BORRANDO" && (
                <BorrarProyecto proyecto={proyecto} publicar={emitir} />
            )}
        </Detalle>
    );
};
