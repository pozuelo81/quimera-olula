import { z } from "zod";
import { CommonSchemas } from "@a2ui/web_core/v0_9";
import { createComponentImplementation } from "@a2ui/react/v0_9";
import { IconChartBar } from "@tabler/icons-react";
import "./TarjetaMetrica.css";

export const TarjetaMetricaApi = {
    name: "TarjetaMetrica",
    schema: z.object({
        titulo: CommonSchemas.DynamicString,
        valor: CommonSchemas.DynamicString,
        detalle: CommonSchemas.DynamicString.optional(),
    }),
};

export const TarjetaMetrica = createComponentImplementation(TarjetaMetricaApi, ({ props }) => (
    <div className="asistente-metrica">
        <div className="asistente-metrica__icono">
            <IconChartBar size={20} />
        </div>
        <div className="asistente-metrica__cuerpo">
            <p className="asistente-metrica__titulo">{String(props.titulo)}</p>
            <p className="asistente-metrica__valor">{String(props.valor)}</p>
            {props.detalle && <p className="asistente-metrica__detalle">{String(props.detalle)}</p>}
        </div>
    </div>
));
