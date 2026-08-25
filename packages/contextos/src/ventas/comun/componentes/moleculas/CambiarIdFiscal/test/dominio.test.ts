import { validacionCampoModelo } from "@olula/lib/dominio.js";
import { describe, expect, test } from "vitest";
import { cambioIdFiscalVacio, idFiscalCompletoValido, metaCambioIdFiscal } from "../dominio.ts";

const validar = validacionCampoModelo(metaCambioIdFiscal);

describe("validación de id fiscal según el tipo", () => {
    test("el NIF debe tener 9 caracteres", () => {
        const modelo = { ...cambioIdFiscalVacio, tipo_id_fiscal: "NIF", id_fiscal: "12345678Z" };
        expect(validar(modelo, "id_fiscal")).toBe(true);

        const corto = { ...modelo, id_fiscal: "1234" };
        expect(validar(corto, "id_fiscal")).toBe("El NIF debe tener 9 caracteres");
    });

    test("el VAT debe cumplir ESXXXXXXXXXX", () => {
        const modelo = { ...cambioIdFiscalVacio, tipo_id_fiscal: "VAT", id_fiscal: "ES12345678Z" };
        expect(validar(modelo, "id_fiscal")).toBe(true);

        const sinPrefijo = { ...modelo, id_fiscal: "12345678901" };
        expect(validar(sinPrefijo, "id_fiscal")).toBe("El VAT debe cumplir ESXXXXXXXXXX");
    });

    test("un NIF válido deja de serlo al cambiar el tipo a VAT", () => {
        const nif = { ...cambioIdFiscalVacio, tipo_id_fiscal: "NIF", id_fiscal: "12345678Z" };
        expect(validar(nif, "id_fiscal")).toBe(true);

        const vat = { ...nif, tipo_id_fiscal: "VAT" };
        expect(validar(vat, "id_fiscal")).toBe("El VAT debe cumplir ESXXXXXXXXXX");
    });

    test("el tipo debe ser NIF o VAT", () => {
        const modelo = { ...cambioIdFiscalVacio, tipo_id_fiscal: "OTRO", id_fiscal: "12345678Z" };
        expect(validar(modelo, "tipo_id_fiscal")).toBe("El tipo debe ser NIF o VAT");
    });

    test("el tipo vacío no es válido", () => {
        expect(validar(cambioIdFiscalVacio, "tipo_id_fiscal")).toBe("El tipo debe ser NIF o VAT");
    });

    test("idFiscalCompletoValido exige tipo e id coherentes", () => {
        expect(idFiscalCompletoValido({ tipo_id_fiscal: "NIF", id_fiscal: "12345678Z" })).toBe(true);
        expect(idFiscalCompletoValido({ tipo_id_fiscal: "VAT", id_fiscal: "12345678Z" })).toBe(false);
        expect(idFiscalCompletoValido({ tipo_id_fiscal: "", id_fiscal: "12345678Z" })).toBe(false);
    });
});
