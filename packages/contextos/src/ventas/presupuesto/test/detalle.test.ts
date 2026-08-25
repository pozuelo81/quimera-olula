import {
    editable,
    metaPresupuesto,
    presupuestoVacio,
} from "#/ventas/presupuesto/detalle/detalle.ts";
import { modeloEsEditable } from "@olula/lib/dominio.ts";
import { describe, expect, test } from "vitest";

const aprobado = () => ({ ...presupuestoVacio(), aprobado: true });

describe("un presupuesto se edita hasta que se aprueba", () => {
    test("recién creado se edita", () => {
        expect(editable(presupuestoVacio())).toBe(true);
    });

    test("aprobado deja de editarse", () => {
        expect(editable(aprobado())).toBe(false);
    });
});

describe("campos que no se tocan a mano ni en un presupuesto abierto", () => {
    const campoEditable = modeloEsEditable(metaPresupuesto);
    const abierto = presupuestoVacio();

    test("divisa, tasa, agente y comisión solo cambian por su modal", () => {
        expect(campoEditable(abierto, "divisa_id")).toBe(false);
        expect(campoEditable(abierto, "tasa_conversion")).toBe(false);
        expect(campoEditable(abierto, "agente_id")).toBe(false);
        expect(campoEditable(abierto, "por_comision")).toBe(false);
    });

    test("el código lo pone el servidor", () => {
        expect(campoEditable(abierto, "codigo")).toBe(false);
    });

    test("las fechas sí se editan", () => {
        expect(campoEditable(abierto, "fecha")).toBe(true);
        expect(campoEditable(abierto, "fecha_salida")).toBe(true);
    });

    test("aprobarlo bloquea también las fechas", () => {
        expect(campoEditable(aprobado(), "fecha")).toBe(false);
        expect(campoEditable(aprobado(), "fecha_salida")).toBe(false);
    });
});
