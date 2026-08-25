import { beforeEach, describe, expect, test, vi } from "vitest";

const post = vi.fn(async (_url: string, _body: unknown, _msg?: string) => ({
    id: "alb-1",
}));

vi.mock("@olula/lib/api/rest_api.ts", () => ({
    RestAPI: {
        post: (url: string, body: unknown, msg?: string) => post(url, body, msg),
    },
}));

const { postAlbaran } = await import("#/ventas/albaran/infraestructura.ts");

const clienteEnviado = () =>
    (post.mock.calls[0][1] as { cliente: Record<string, unknown> }).cliente;

describe("postAlbaran adapta el cliente a cada forma de alta", () => {
    beforeEach(() => post.mockClear());

    test("el cliente de maestro va como par de ids", async () => {
        await postAlbaran({
            cliente_id: "CLI-1",
            direccion_id: "DIR-1",
            empresa_id: "",
        });

        expect(clienteEnviado()).toEqual({
            cliente_id: "CLI-1",
            direccion_id: "DIR-1",
        });
    });

    test("el cliente de paso va con la dirección anidada y provincia_id a null", async () => {
        await postAlbaran({
            empresa_id: "",
            nombre_cliente: "Cliente de paso",
            id_fiscal: "B12345678",
            nombre_via: "Gran Vía",
            tipo_via: "Calle",
            ciudad: "Granada",
        });

        expect(clienteEnviado()).toEqual({
            nombre: "Cliente de paso",
            id_fiscal: "B12345678",
            direccion: {
                nombre_via: "Gran Vía",
                tipo_via: "Calle",
                numero: null,
                otros: null,
                cod_postal: null,
                ciudad: "Granada",
                provincia_id: null,
                provincia: null,
                pais_id: null,
                apartado: null,
                telefono: null,
            },
        });
    });
});
