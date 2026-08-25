import { lineaAlbaranFromAPI } from "#/ventas/albaran/infraestructura.ts";
import { lineaFacturaFromAPI } from "#/ventas/factura/infraestructura.ts";
import { ventasPedidoInfra } from "#/ventas/pedido/infraestructura.ts";
import { lineaPresupuestoFromAPI } from "#/ventas/presupuesto/infraestructura.ts";
import type { LineaVenta } from "#/ventas/venta/diseño.ts";
import { describe, expect, test } from "vitest";

// Objeto con forma de API (snake_case para descripcion_articulo, resto igual al dominio)
const lineaApi = {
    id: "linea-1",
    referencia: "ART-001",
    descripcion: "Artículo 001",
    descripcionArticulo: null,    // campo dominio (LineaVenta)
    descripcion_articulo: null,   // campo API (LineaXxxAPI)
    cantidad: 2,
    pvp_unitario: 100,
    dto_porcentual: 10,
    dto_lineal: 12.5,
    pvp_total: 177.5,
    iva_incluido: false,
    grupo_iva_producto_id: "GENERAL",
    tipo_irpf: 15,
    tipo_recargo: 5.2,
    tipo_iva: 21,
    por_comision: 3.5,
    importe_comision: 24.85,
};

const casos: [string, LineaVenta][] = [
    ["presupuesto", lineaPresupuestoFromAPI(lineaApi as Parameters<typeof lineaPresupuestoFromAPI>[0])],
    ["pedido", ventasPedidoInfra.linea_desde_api(lineaApi as Parameters<typeof ventasPedidoInfra.linea_desde_api>[0])],
    ["albarán", lineaAlbaranFromAPI(lineaApi as Parameters<typeof lineaAlbaranFromAPI>[0])],
    ["factura", lineaFacturaFromAPI(lineaApi as Parameters<typeof lineaFacturaFromAPI>[0])],
];

describe.each(casos)("los campos fiscales llegan al dominio (%s)", (_, linea) => {
    test("descuento lineal", () => {
        expect(linea.dto_lineal).toBe(12.5);
    });

    test("tipo de IRPF", () => {
        expect(linea.tipo_irpf).toBe(15);
    });

    test("tipo de recargo de equivalencia", () => {
        expect(linea.tipo_recargo).toBe(5.2);
    });

    test("tipo de IVA", () => {
        expect(linea.tipo_iva).toBe(21);
    });

    test("porcentaje e importe de comisión", () => {
        expect(linea.por_comision).toBe(3.5);
        expect(linea.importe_comision).toBe(24.85);
    });
});
