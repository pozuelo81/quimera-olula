import { fichaAApi, fichaNueva } from "#/comun/informe_documentos/dominio.ts";
import { describe, expect, test } from "vitest";
import { ALBARANES, PEDIDOS, PESTAÑAS_COMPRAS } from "../pestañas.tsx";

const ids = (filas: { id: string }[][]) => filas.flat().map((campo) => campo.id);

const COMUNES = [
    "tipo_informe",
    "codigo_desde",
    "codigo_hasta",
    "ejercicio_id",
    "intervalo",
    "fecha_desde",
    "fecha_hasta",
    "proveedor_id",
    "orden1",
    "tipo_orden1",
    "orden2",
    "tipo_orden2",
];

describe("pestañas de Compras > Informes", () => {
    test("cada pestaña con su API, los criterios comunes y sin agente", () => {
        PESTAÑAS_COMPRAS.forEach((pestaña) => {
            expect(pestaña.url).toBe(`/compras/informe/${pestaña.clave}`);
            expect(ids(pestaña.filas)).toEqual(expect.arrayContaining(COMUNES));
            expect(ids(pestaña.filas)).not.toContain("agente_id");
            expect(fichaAApi(pestaña, fichaNueva(pestaña)).tipo_informe).toBe("Moneda original");
        });
    });

    test("pedidos: fechas de entrada, servidos, líneas y tres modos de cálculo", () => {
        expect(ids(PEDIDOS.filas)).toEqual(
            expect.arrayContaining([
                "intervalo_entrada",
                "fecha_entrada_desde",
                "fecha_entrada_hasta",
                "servido",
                "mostrar_lineas",
                "solo_pendientes",
            ])
        );
        expect(PEDIDOS.modos?.map((m) => m.etiqueta)).toEqual([
            "Calcular detalle",
            "Calcular resumen",
            "Calcular resumen por líneas",
        ]);
    });

    test("albaranes: pendiente de facturar", () => {
        expect(ids(ALBARANES.filas)).toContain("pte_factura");
        expect(ALBARANES.modos).toBeUndefined();
    });


});
