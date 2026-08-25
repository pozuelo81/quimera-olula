import { AltaLineaVentaApi } from "#/ventas/venta/infraestructura.ts";
import { esLineaConArticulo } from "#/ventas/venta/dominio.ts";
import {
    metaNuevaLinea,
    nuevaLineaVacia,
} from "#/ventas/presupuesto/crear_linea/dominio.ts";
import { modeloEsValido } from "@olula/lib/dominio.ts";
import { beforeEach, describe, expect, test, vi } from "vitest";

const post = vi.fn(
    async (_url: string, _body: unknown, _msg?: string) => ({ ids: ["lin-1"] })
);

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        post: (url: string, body: unknown, msg?: string) => post(url, body, msg),
    },
}));

const { postLinea } = await import("#/ventas/presupuesto/infraestructura.ts");

const cuerpoEnviado = () =>
    (post.mock.calls[0][1] as { lineas: AltaLineaVentaApi[] }).lineas[0];

describe("esLineaConArticulo distingue las dos formas de línea", () => {
    test("con referencia es línea de catálogo", () => {
        expect(esLineaConArticulo({ referencia: "ART-001", cantidad: 3 })).toBe(true);
    });

    test("sin referencia es línea libre", () => {
        expect(
            esLineaConArticulo({ descripcion: "Portes", cantidad: 1, pvp_unitario: 15 })
        ).toBe(false);
    });
});

describe("postLinea adapta el payload a cada forma", () => {
    beforeEach(() => post.mockClear());

    test("la línea de catálogo manda articulo.articulo_id y cantidad aparte", async () => {
        await postLinea("pre-1", { articulo: { articuloId: "ART-001" }, cantidad: 3 });

        expect(cuerpoEnviado()).toEqual({
            articulo: { articulo_id: "ART-001" },
            cantidad: 3,
        });
    });

    test("la línea libre manda descripción y pvp en articulo, sin articulo_id", async () => {
        await postLinea("pre-1", {
            articulo: { descripcion: "Mano de obra", pvpUnitario: 50 },
            cantidad: 2,
        });

        expect(cuerpoEnviado()).toEqual({
            articulo: { descripcion: "Mano de obra", pvp_unitario: 50 },
            cantidad: 2,
        });
        expect(cuerpoEnviado().articulo).not.toHaveProperty("articulo_id");
    });

    test("devuelve el id que responde el servidor", async () => {
        const id = await postLinea("pre-1", { articulo: { articuloId: "ART-001" }, cantidad: 1 });
        expect(id).toBe("lin-1");
    });
});

describe("validación de la nueva línea", () => {
    const valido = modeloEsValido(metaNuevaLinea);
    const lineaLibreBase = { ...nuevaLineaVacia, tipoArticulo: "libre" as const, referencia: null };

    test("un pvp de 0 es válido en una línea libre", () => {
        expect(valido({ ...lineaLibreBase, descripcion: "Portes", pvp_unitario: 0 })).toBe(true);
    });

    test("sin descripción no vale en línea libre", () => {
        expect(valido({ ...lineaLibreBase, descripcion: "", pvp_unitario: 15 })).toBe(false);
    });

    test("sin referencia ni descripción no vale", () => {
        expect(valido({ ...nuevaLineaVacia, referencia: null, descripcion: null, pvp_unitario: 15 })).toBe(false);
    });
});
