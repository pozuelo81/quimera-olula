import { metaTablaLineaVenta } from "#/ventas/venta/vistas/metatabla_linea_venta.tsx";
import { LineaVenta } from "#/ventas/venta/diseño.ts";
import { describe, expect, test } from "vitest";

const lineaVacia = (): LineaVenta => ({
    id: "lin-1",
    referencia: null,
    descripcion: "",
    descripcionArticulo: null,
    cantidad: 1,
    pvp_unitario: 0,
    dto_porcentual: 0,
    dto_lineal: 0,
    pvp_total: 0,
    iva_incluido: false,
    grupo_iva_producto_id: "GEN",
    tipo_irpf: 0,
    tipo_recargo: 0,
    tipo_iva: 21,
    por_comision: 0,
    importe_comision: 0,
});

const etiqueta = (linea: LineaVenta) => {
    const columna = metaTablaLineaVenta<LineaVenta>().find((c) => c.id === "linea");
    return columna?.render?.(linea);
};

describe("columna Línea de la tabla de líneas", () => {
    test("con artículo muestra referencia y descripción", () => {
        expect(
            etiqueta({ ...lineaVacia(), referencia: "002", descripcion: "producto2" })
        ).toBe("002: producto2");
    });

    test("sin artículo muestra solo la descripción", () => {
        expect(
            etiqueta({ ...lineaVacia(), referencia: null, descripcion: "tenerife" })
        ).toBe("tenerife");
    });

    test("una referencia vacía tampoco ensucia la etiqueta", () => {
        expect(
            etiqueta({ ...lineaVacia(), referencia: "", descripcion: "Portes" })
        ).toBe("Portes");
    });
});
