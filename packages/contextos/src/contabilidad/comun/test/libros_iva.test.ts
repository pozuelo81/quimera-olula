import { describe, expect, test } from "vitest";
import {
    filtroIvaVacio,
    metaFormularioLibroIva,
    presentacionIvaVacia,
} from "../librosIva.ts";

const ficha = (campos: Record<string, unknown> = {}) => ({
    descripcion: "IVA 2026",
    ejercicioId: "2026",
    fechaDesde: "2026-01-01",
    fechaHasta: "2026-12-31",
    ...filtroIvaVacio(),
    ...presentacionIvaVacia(),
    ...campos,
});

describe("formulario de los libros de I.V.A.", () => {
    const meta = metaFormularioLibroIva<ReturnType<typeof ficha>>();

    test("las opciones booleanas son casillas", () => {
        for (const campo of [
            "todos",
            "conIva",
            "mostrarTotalFactura",
            "mostrarNif",
            "mostrarDocumento",
            "mostrarAsiento",
            "numeracionAutomatica",
        ]) {
            expect(meta.campos?.[campo]?.tipo).toBe("checkbox");
        }
    });

    test("las casillas quedan como booleanos al cambiar", () => {
        const resultado = meta.onChange?.(
            ficha({ mostrarNif: "false", numeracionAutomatica: "true" }),
            "mostrarNif",
            true
        );
        expect(resultado?.mostrarNif).toBe(false);
        expect(resultado?.numeracionAutomatica).toBe(true);
    });
});
