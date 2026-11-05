import { avisoIvaDefecto, configAlmacenPorDefecto } from "#/almacen/config/dominio.ts";
import { configAlmacenAApi, configAlmacenDesdeApi } from "#/almacen/config/infraestructura.ts";
import { describe, expect, test } from "vitest";

describe("configuración de almacén", () => {
    test("por defecto no se usa IVA por defecto, como en el escritorio", () => {
        expect(configAlmacenPorDefecto).toEqual({ impuestoId: "", usarIvaDefecto: false });
    });

    test("sin impuesto va como nulo a la API", () => {
        const api = { impuesto_id: null, usar_iva_defecto: true };
        const config = configAlmacenDesdeApi(api);
        expect(config.impuestoId).toBe("");
        expect(configAlmacenAApi(config)).toEqual(api);
    });

    test("avisa si se usa el IVA por defecto sin elegir impuesto", () => {
        expect(avisoIvaDefecto({ impuestoId: "", usarIvaDefecto: true })).not.toBe("");
        expect(avisoIvaDefecto({ impuestoId: "GEN", usarIvaDefecto: true })).toBe("");
        expect(avisoIvaDefecto({ impuestoId: "", usarIvaDefecto: false })).toBe("");
    });
});
