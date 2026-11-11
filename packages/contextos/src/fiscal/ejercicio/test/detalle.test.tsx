import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";

vi.mock("@olula/lib/dominio.ts", async (original) => ({
    ...(await original<typeof import("@olula/lib/dominio.ts")>()),
    puede: () => true,
}));
vi.mock("#/contabilidad/ejercicio/infraestructura.ts", async (original) => ({
    ...(await original<typeof import("#/contabilidad/ejercicio/infraestructura.ts")>()),
    getEjercicio: async (id: string) => ({
        id, nombre: `EJERCICIO ${id}`, empresaId: 1,
        fechaInicio: new Date(2026, 0, 1, 12), fechaFin: new Date(2026, 11, 31, 12),
        estado: "ABIERTO", digitosSubcuenta: 10, planContable: "08", tienePgc: true,
        asientoAperturaId: null, asientoPygId: null, asientoCierreId: null,
    }),
    getSeriesEjercicio: async () => [{ id: "1", serieId: "A", descripcion: "SERIE A" }],
    getOpcionesSeries: async () => [],
    getFilasAsientosEjercicio: async () => [],
    getSecuenciasContabilidad: async () => [],
}));

import { DetalleEjercicioFiscal } from "../detalle/DetalleEjercicioFiscal.tsx";

const filaDe = (texto: string) =>
    screen.getByText(texto, { selector: ".etiqueta" }).closest(".FilaFormulario");

const pintar = () => render(
    <MemoryRouter><DetalleEjercicioFiscal id="2026" ejercicios={[]} /></MemoryRouter>
);

describe("edición de ejercicio fiscal (B4a)", () => {
    test("Código + Nombre, Inicio + Fin + Dígitos y Estado + Plan contable en filas", async () => {
        pintar();
        expect(await screen.findByText("SERIE A")).toBeInTheDocument();
        expect(filaDe("Código")).not.toBeNull();
        expect(filaDe("Código")).toBe(filaDe("Nombre"));
        expect(filaDe("Inicio")).toBe(filaDe("Dígitos de subcuenta"));
        expect(filaDe("Estado")).not.toBeNull();
        expect(filaDe("Estado")).toBe(filaDe("Plan contable"));
    });

    test("sin el campo Serie: las series se añaden y copian desde botones", async () => {
        pintar();
        await screen.findByText("SERIE A");
        expect(screen.queryByText("Serie", { selector: ".etiqueta" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Añadir serie" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Quitar serie" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Copiar series" })).toBeInTheDocument();
    });
});
