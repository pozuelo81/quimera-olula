import { empresaActual } from "#/valores/empresaActual.ts";
import { afterEach, describe, expect, test } from "vitest";

const conWhoAmI = (whoami: unknown) =>
    localStorage.setItem("whoami", JSON.stringify(whoami));

describe("empresaActual sale del whoami", () => {
    afterEach(() => localStorage.removeItem("whoami"));

    test("toma la empresa del usuario", () => {
        conWhoAmI({ usuario_id: "juanma", empresas: [{ id: "1", nombre: "Yeboyebo" }] });
        expect(empresaActual()).toBe("1");
    });

    test("con varias empresas se queda con la primera", () => {
        conWhoAmI({
            empresas: [
                { id: "7", nombre: "Segunda sociedad" },
                { id: "1", nombre: "Yeboyebo" },
            ],
        });
        expect(empresaActual()).toBe("7");
    });

    test("sin whoami no inventa una empresa", () => {
        expect(empresaActual()).toBe("");
    });

    test("con lista de empresas vacía tampoco", () => {
        conWhoAmI({ usuario_id: "juanma", empresas: [] });
        expect(empresaActual()).toBe("");
    });

    test("un whoami corrupto no revienta", () => {
        localStorage.setItem("whoami", "{no es json");
        expect(empresaActual()).toBe("");
    });

    test("se relee en cada llamada, no se queda con lo del arranque", () => {
        expect(empresaActual()).toBe("");
        conWhoAmI({ empresas: [{ id: "1", nombre: "Yeboyebo" }] });
        expect(empresaActual()).toBe("1");
    });
});
