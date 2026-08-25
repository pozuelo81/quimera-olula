import { articuloDeLinea } from "#/ventas/venta/infraestructura.ts";
import { LineaVenta } from "#/ventas/venta/diseño.ts";
import { describe, expect, test } from "vitest";

describe("bloque articulo del PATCH de línea", () => {
    test("con referencia manda el id del catálogo", () => {
        // línea registrada: descripcion coincide con descripcionArticulo
        expect(articuloDeLinea({ referencia: "ART-001", descripcion: "producto2", descripcionArticulo: "producto2" } as LineaVenta)).toEqual({
            articulo_id: "ART-001",
        });
    });

    test("sin referencia manda la descripción", () => {
        expect(articuloDeLinea({ referencia: null, descripcion: "Mano de obra" } as LineaVenta)).toEqual({
            descripcion: "Mano de obra",
        });
    });

    test("una referencia vacía cuenta como línea sin artículo", () => {
        expect(articuloDeLinea({ referencia: "", descripcion: "Portes" } as LineaVenta)).toEqual({
            descripcion: "Portes",
        });
    });

    test("los dos campos son excluyentes", () => {
        // registrada: descripcion == descripcionArticulo → solo articulo_id
        expect(articuloDeLinea({ referencia: "ART-001", descripcion: "x", descripcionArticulo: "x" } as LineaVenta)).not.toHaveProperty("descripcion");
        expect(articuloDeLinea({ referencia: null, descripcion: "x" } as LineaVenta)).not.toHaveProperty("articulo_id");
    });
});
