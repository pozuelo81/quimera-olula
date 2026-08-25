import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useEffect } from "react";
import { Remesa } from "../diseño.js";
import { contextoDetalleRemesaInicial, metaRemesa } from "./detalle.js";
import "./DetalleRemesa.css";
import { getMaquina } from "./maquina.js";
import { TabGeneral } from "./TabGeneral.js";

export const DetalleRemesa = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {

    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoDetalleRemesaInicial,
        publicar
    );

    const formModelo = useModelo(metaRemesa, ctx.remesa);

    useEffect(() => {
        emitir("remesa_id_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!ctx.remesa.id) return null;

    const titulo = (r: Remesa) => `Remesa ${r.id}`;

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={ctx.remesa}
            cerrarDetalle={() => emitir("remesa_deseleccionada", null, true)}
        >
            <div className="DetalleRemesa">
                <Tabs children={[
                    <Tab label="General"
                        key="tab-general"
                        children={<TabGeneral form={formModelo} />}
                    />,
                ]} />
            </div>
        </Detalle>
    );
};
