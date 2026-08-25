import { albaranVacio, metaAlbaran, tituloAlbaran } from "#/ventas/albaran/dominio.ts";
import { modeloEsEditable } from "@olula/lib/dominio.ts";
import { describe, expect, test } from "vitest";

describe("albaranVacio", () => {
    test("el abono empieza desmarcado y el almacén vacío", () => {
        const albaran = albaranVacio();
        expect(albaran.de_abono).toBe(false);
        expect(albaran.almacen_id).toBe("");
        expect(albaran.nombre_almacen).toBe("");
        expect(albaran.hora).toBe("");
    });
});

describe("tituloAlbaran marca los abonos", () => {
    test("un albarán normal muestra solo su código", () => {
        expect(tituloAlbaran({ ...albaranVacio(), codigo: "ALB-001" })).toBe("ALB-001");
    });

    test("un abono se distingue en el título", () => {
        expect(
            tituloAlbaran({ ...albaranVacio(), codigo: "ALB-001", de_abono: true })
        ).toBe("ALB-001 · Abono");
    });
});

describe("campos nuevos de la cabecera del albarán", () => {
    const editable = modeloEsEditable(metaAlbaran);

    test("hora, almacén y abono se editan mientras no esté facturado", () => {
        const albaran = albaranVacio();
        expect(editable(albaran, "hora")).toBe(true);
        expect(editable(albaran, "almacen_id")).toBe(true);
        expect(editable(albaran, "de_abono")).toBe(true);
    });

    test("el nombre del almacén es solo descripción", () => {
        expect(editable(albaranVacio(), "nombre_almacen")).toBe(false);
    });

    test("un albarán facturado los bloquea todos", () => {
        const facturado = { ...albaranVacio(), facturado: true };
        expect(editable(facturado, "hora")).toBe(false);
        expect(editable(facturado, "almacen_id")).toBe(false);
        expect(editable(facturado, "de_abono")).toBe(false);
    });
});
