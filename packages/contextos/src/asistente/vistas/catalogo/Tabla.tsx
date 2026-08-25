import { useState } from "react";
import { z } from "zod";
import { CommonSchemas } from "@a2ui/web_core/v0_9";
import { createComponentImplementation } from "@a2ui/react/v0_9";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { Entidad } from "@olula/lib/diseño.ts";
import { ColumnaA2uiSchema, columnasAMetaTabla } from "#/asistente/vistas/catalogo/columnas.ts";
import { useAsistenteContext } from "#/asistente/vistas/AsistenteRuntimeProvider.tsx";

const FILAS_POR_PAGINA = 10;

const EnlaceFilaSchema = z.object({
    ruta: z.string(),
    parametros: z.record(z.string(), z.string()).optional(),
});

export const TablaApi = {
    name: "Tabla",
    schema: z.object({
        columnas: z.array(ColumnaA2uiSchema),
        filas: CommonSchemas.DynamicValue,
        enlaceFila: EnlaceFilaSchema.optional(),
    }),
};

export const Tabla = createComponentImplementation(TablaApi, ({ props }) => {
    const { enviarAccion } = useAsistenteContext();
    const enlaceFila = props.enlaceFila;
    // Paginación puramente en cliente: todas las filas ya llegaron en este mismo mensaje
    // (mostrar_tabla las manda de una vez), así que pasar de página es solo un slice
    // local — sin ida y vuelta al asistente.
    const [pagina, setPagina] = useState(1);

    const onSeleccion = enlaceFila
        ? (entidad: Entidad) => {
              void enviarAccion({
                  name: "navegar",
                  surfaceId: "tabla",
                  sourceComponentId: "fila",
                  timestamp: new Date().toISOString(),
                  context: {
                      ruta: enlaceFila.ruta,
                      parametros: { ...enlaceFila.parametros, id: String(entidad.id) },
                  },
              });
          }
        : undefined;

    const todasLasFilas = Array.isArray(props.filas) ? (props.filas as Entidad[]) : [];
    const inicio = (pagina - 1) * FILAS_POR_PAGINA;
    const filasDePagina = todasLasFilas.slice(inicio, inicio + FILAS_POR_PAGINA);

    return (
        <QTabla<Entidad>
            metaTabla={columnasAMetaTabla(props.columnas)}
            datos={filasDePagina}
            cargando={false}
            orden={[]}
            onSeleccion={onSeleccion}
            paginacion={{ pagina, limite: FILAS_POR_PAGINA }}
            onPaginacion={p => setPagina(p)}
            totalEntidades={todasLasFilas.length}
        />
    );
});
