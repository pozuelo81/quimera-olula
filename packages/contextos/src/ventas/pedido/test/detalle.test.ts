import { editable, metaPedido, pedidoVacio } from "#/ventas/pedido/detalle/detalle.ts";
import { Pedido } from "#/ventas/pedido/diseño.ts";
import { modeloEsEditable } from "@olula/lib/dominio.ts";
import { describe, expect, test } from "vitest";

const pedido = (servido: string): Pedido => ({ ...pedidoVacio(), servido });

describe("un pedido se edita mientras no esté servido del todo", () => {
    test("pendiente y parcial se editan", () => {
        expect(editable(pedido("PENDIENTE"))).toBe(true);
        expect(editable(pedido("PARCIAL"))).toBe(true);
    });

    test("total y servido lo bloquean", () => {
        expect(editable(pedido("TOTAL"))).toBe(false);
        expect(editable(pedido("SERVIDO"))).toBe(false);
    });

    test("el estado se compara sin distinguir mayúsculas", () => {
        expect(editable(pedido("total"))).toBe(false);
        expect(editable(pedido("Servido"))).toBe(false);
    });

    test("sin estado se considera editable", () => {
        const sinServido = { ...pedidoVacio(), servido: undefined as unknown as string };
        expect(editable(sinServido)).toBe(true);
    });
});

describe("campos que no se tocan a mano ni en un pedido abierto", () => {
    const campoEditable = modeloEsEditable(metaPedido);
    const abierto = pedido("PENDIENTE");

    test("divisa, tasa, agente y comisión solo cambian por su modal", () => {
        expect(campoEditable(abierto, "divisa_id")).toBe(false);
        expect(campoEditable(abierto, "tasa_conversion")).toBe(false);
        expect(campoEditable(abierto, "agente_id")).toBe(false);
        expect(campoEditable(abierto, "por_comision")).toBe(false);
    });

    test("el nombre del almacén es solo descripción", () => {
        expect(campoEditable(abierto, "nombre_almacen")).toBe(false);
    });

    test("fechas y almacén sí se editan", () => {
        expect(campoEditable(abierto, "fecha")).toBe(true);
        expect(campoEditable(abierto, "fecha_salida")).toBe(true);
        expect(campoEditable(abierto, "almacen_id")).toBe(true);
    });

    test("un pedido servido bloquea también los que sí se editaban", () => {
        const servido = pedido("TOTAL");
        expect(campoEditable(servido, "fecha")).toBe(false);
        expect(campoEditable(servido, "almacen_id")).toBe(false);
    });
});
