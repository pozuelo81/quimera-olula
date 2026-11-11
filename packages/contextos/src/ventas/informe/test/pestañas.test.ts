import { describe, expect, test } from "vitest";
import { PEDIDOS, PESTAÑAS_VENTAS, PRESUPUESTOS } from "../pestañas.tsx";

const ids = (filas: { id: string }[][]) => filas.flat().map((campo) => campo.id);

const COMUNES = [
    "codigo_desde",
    "codigo_hasta",
    "ejercicio_id",
    "intervalo",
    "fecha_desde",
    "fecha_hasta",
    "cliente_id",
    "agente_id",
    "orden1",
    "tipo_orden1",
    "orden2",
    "tipo_orden2",
];

describe("pestañas de Ventas > Informes", () => {
    test("cada pestaña con su API", () => {
        PESTAÑAS_VENTAS.forEach((pestaña) => {
            expect(pestaña.url).toBe(`/ventas/informe/${pestaña.clave}`);
        });
    });

    test("todas tienen los criterios comunes de i_*cli", () => {
        PESTAÑAS_VENTAS.forEach((pestaña) => {
            expect(ids(pestaña.filas)).toEqual(expect.arrayContaining(COMUNES));
        });
    });

    test("presupuestos: pendiente de aprobar", () => {
        expect(ids(PRESUPUESTOS.filas)).toContain("pte_aprobar");
        expect(PRESUPUESTOS.inicial.pte_aprobar).toBe("Todos");
    });

    test("pedidos: servido, serie, referencia y líneas", () => {
        expect(ids(PEDIDOS.filas)).toEqual(
            expect.arrayContaining(["servido", "serie_id", "referencia", "mostrar_lineas", "solo_pendientes"])
        );
    });


});
