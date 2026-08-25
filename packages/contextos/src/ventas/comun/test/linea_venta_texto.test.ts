import {
    desgloseLineaVenta,
    fiscalidadLineaVenta,
    LineaVentaTarjeta,
    tituloLineaVenta,
} from "#/ventas/comun/componentes/linea_venta_texto.ts";
import { describe, expect, test } from "vitest";

const linea = (cambios: Partial<LineaVentaTarjeta> = {}): LineaVentaTarjeta => ({
    referencia: "ART1",
    descripcion: "Tornillo M6",
    cantidad: 2,
    pvp_unitario: 10,
    pvp_total: 20,
    ...cambios,
});

describe("tituloLineaVenta une referencia y descripción", () => {
    test("con las dos, la referencia va delante", () => {
        expect(tituloLineaVenta(linea())).toBe("ART1 - Tornillo M6");
    });

    test("sin referencia queda solo la descripción", () => {
        expect(tituloLineaVenta(linea({ referencia: null }))).toBe("Tornillo M6");
        expect(tituloLineaVenta(linea({ referencia: "" }))).toBe("Tornillo M6");
    });

    test("sin descripción se avisa en lugar de dejarlo en blanco", () => {
        expect(tituloLineaVenta(linea({ descripcion: "" }))).toBe("ART1 - Sin descripción");
        expect(tituloLineaVenta(linea({ descripcion: null }))).toBe("ART1 - Sin descripción");
    });

    test("sin nada de nada", () => {
        expect(tituloLineaVenta(linea({ referencia: null, descripcion: null }))).toBe(
            "Sin descripción"
        );
    });
});

describe("desgloseLineaVenta compone cantidad, precio y descuentos", () => {
    test("sin descuentos son cantidad y precio", () => {
        expect(desgloseLineaVenta(linea())).toBe("2 x 10,00\u00a0€");
    });

    test("el descuento porcentual va entre paréntesis", () => {
        expect(desgloseLineaVenta(linea({ dto_porcentual: 15 }))).toBe(
            "2 x 10,00\u00a0€ (15% Dto)"
        );
    });

    test("el descuento lineal va formateado como moneda", () => {
        expect(desgloseLineaVenta(linea({ dto_lineal: 5 }))).toBe(
            "2 x 10,00\u00a0€ (5,00\u00a0€ Dto)"
        );
    });

    test("los dos descuentos conviven separados por coma", () => {
        expect(desgloseLineaVenta(linea({ dto_porcentual: 15, dto_lineal: 5 }))).toBe(
            "2 x 10,00\u00a0€ (15% Dto, 5,00\u00a0€ Dto)"
        );
    });

    test("un descuento a cero no aparece", () => {
        expect(desgloseLineaVenta(linea({ dto_porcentual: 0, dto_lineal: 0 }))).toBe(
            "2 x 10,00\u00a0€"
        );
    });

    test("una cantidad ilegible cuenta como cero", () => {
        const rara = linea({ cantidad: "dos" as unknown as number });
        expect(desgloseLineaVenta(rara)).toBe("0 x 10,00\u00a0€");
    });

    test("la divisa por defecto es el euro y se puede cambiar", () => {
        expect(desgloseLineaVenta(linea(), "USD")).toBe("2 x $10.00");
    });
});

describe("fiscalidadLineaVenta enumera impuestos y comisión", () => {
    test("sin nada informado no dice nada", () => {
        expect(fiscalidadLineaVenta(linea())).toBe("");
    });

    test("el IVA se identifica por su grupo", () => {
        expect(fiscalidadLineaVenta(linea({ grupo_iva_producto_id: "GENERAL" }))).toBe(
            "IVA GENERAL"
        );
    });

    test("recargo e IRPF llevan su porcentaje", () => {
        expect(fiscalidadLineaVenta(linea({ tipo_recargo: 5.2, tipo_irpf: 15 }))).toBe(
            "R.E. 5.2% · IRPF 15%"
        );
    });

    test("la comisión lleva su importe cuando lo hay", () => {
        expect(
            fiscalidadLineaVenta(linea({ por_comision: 3, importe_comision: 0.6 }))
        ).toBe("Com. 3% (0,60\u00a0€)");
    });

    test("y va sola cuando el importe es cero", () => {
        expect(fiscalidadLineaVenta(linea({ por_comision: 3, importe_comision: 0 }))).toBe(
            "Com. 3%"
        );
    });

    test("todo junto va en orden y separado por puntos", () => {
        const completa = linea({
            grupo_iva_producto_id: "GENERAL",
            tipo_recargo: 5.2,
            tipo_irpf: 15,
            por_comision: 3,
            importe_comision: 0.6,
        });
        expect(fiscalidadLineaVenta(completa)).toBe(
            "IVA GENERAL · R.E. 5.2% · IRPF 15% · Com. 3% (0,60\u00a0€)"
        );
    });

    test("los ceros no ensucian la lista", () => {
        const ceros = linea({ tipo_recargo: 0, tipo_irpf: 0, por_comision: 0 });
        expect(fiscalidadLineaVenta(ceros)).toBe("");
    });
});
