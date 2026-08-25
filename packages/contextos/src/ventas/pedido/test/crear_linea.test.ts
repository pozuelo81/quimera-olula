import { AltaLineaVentaApi } from "#/ventas/venta/infraestructura.ts";
import { beforeEach, describe, expect, test, vi } from "vitest";

const post = vi.fn(
    async (_url: string, _body: unknown, _msg?: string) => ({ ids: ["lin-1"] })
);

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        post: (url: string, body: unknown, msg?: string) => post(url, body, msg),
    },
}));

const { postLinea } = await import("#/ventas/pedido/infraestructura.ts");

const cuerpoEnviado = () =>
    (post.mock.calls[0][1] as { lineas: AltaLineaVentaApi[] }).lineas[0];

describe("postLinea del pedido adapta el payload a cada forma", () => {
    beforeEach(() => post.mockClear());

    test("la línea de catálogo manda articulo.articulo_id y cantidad aparte", async () => {
        await postLinea("ped-1", { articulo: { articuloId: "ART-001" }, cantidad: 3 });

        expect(cuerpoEnviado()).toEqual({
            articulo: { articulo_id: "ART-001" },
            cantidad: 3,
        });
    });

    test("la línea libre manda descripción y pvp en articulo, sin articulo_id", async () => {
        await postLinea("ped-1", {
            articulo: { descripcion: "Mano de obra", pvpUnitario: 50 },
            cantidad: 2,
        });

        expect(cuerpoEnviado()).toEqual({
            articulo: { descripcion: "Mano de obra", pvp_unitario: 50 },
            cantidad: 2,
        });
        expect(cuerpoEnviado().articulo).not.toHaveProperty("articulo_id");
    });
});
