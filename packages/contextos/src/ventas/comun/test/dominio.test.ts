import {
    capitalizarDescripcion,
    esVerdadero,
    fechaAISO,
    formatearDireccionVenta,
    normalizarHora,
} from "#/ventas/comun/dominio.ts";
import { Direccion } from "@olula/lib/diseño.ts";
import { describe, expect, test } from "vitest";

const direccion: Direccion = {
    nombre_via: "Calle Ejemplo",
    tipo_via: "Calle",
    numero: "1",
    otros: "Nave 3",
    cod_postal: "46001",
    ciudad: "Valencia",
    provincia_id: 46,
    provincia: "Valencia",
    pais_id: "ES",
    pais: "España",
    apartado: "",
    telefono: "",
};

describe("formatearDireccionVenta compone la dirección del documento", () => {
    test("incluye vía, número, otros, código postal, ciudad y país", () => {
        expect(formatearDireccionVenta(direccion)).toBe(
            "Calle Ejemplo 1, Nave 3, 46001 Valencia, España"
        );
    });

    test("incluye la provincia cuando no repite la ciudad", () => {
        expect(
            formatearDireccionVenta({ ...direccion, ciudad: "Gandía" })
        ).toBe("Calle Ejemplo 1, Nave 3, 46001 Gandía, Valencia, España");
    });

    test("omite los campos vacíos sin dejar comas sueltas", () => {
        expect(
            formatearDireccionVenta({
                ...direccion,
                otros: "",
                cod_postal: "",
                provincia: "",
                pais: undefined,
            })
        ).toBe("Calle Ejemplo 1, Valencia");
    });

    test("no repite el tipo de vía si el nombre ya lo lleva", () => {
        expect(
            formatearDireccionVenta({ ...direccion, nombre_via: "Calle Mayor" })
        ).toBe("Calle Mayor 1, Nave 3, 46001 Valencia, España");
    });

    test("un tipo de vía que solo se parece no se pierde", () => {
        expect(
            formatearDireccionVenta({
                ...direccion,
                tipo_via: "Calle",
                nombre_via: "Callejón del Gato",
            })
        ).toBe("Calle Callejón del Gato 1, Nave 3, 46001 Valencia, España");
    });

    test("una dirección ausente da cadena vacía", () => {
        expect(formatearDireccionVenta(null)).toBe("");
    });
});

describe("fechaAISO", () => {
    test("convierte un Date al día que espera la API", () => {
        expect(fechaAISO(new Date(Date.parse("2026-03-22")))).toBe("2026-03-22");
    });

    test("recorta una fecha que ya viene como texto", () => {
        expect(fechaAISO("2026-03-22T00:00:00Z")).toBe("2026-03-22");
    });

    test("null y cadena vacía viajan como null", () => {
        expect(fechaAISO(null)).toBe(null);
        expect(fechaAISO("")).toBe(null);
        expect(fechaAISO(undefined)).toBe(null);
    });
});

describe("normalizarHora", () => {
    test("completa los segundos que no manda el input de hora", () => {
        expect(normalizarHora("10:30")).toBe("10:30:00");
    });

    test("respeta una hora completa", () => {
        expect(normalizarHora("10:30:45")).toBe("10:30:45");
    });

    test("rellena con ceros a la izquierda", () => {
        expect(normalizarHora("9:5")).toBe("09:05:00");
    });

    test("una hora vacía viaja como null", () => {
        expect(normalizarHora("")).toBe(null);
        expect(normalizarHora(null)).toBe(null);
    });
});

describe("esVerdadero normaliza los checkbox de useModelo", () => {
    test("acepta booleanos y las cadenas que produce el formulario", () => {
        expect(esVerdadero(true)).toBe(true);
        expect(esVerdadero("true")).toBe(true);
        expect(esVerdadero("1")).toBe(true);
    });

    test("todo lo demás es falso", () => {
        expect(esVerdadero(false)).toBe(false);
        expect(esVerdadero("false")).toBe(false);
        expect(esVerdadero(null)).toBe(false);
        expect(esVerdadero(undefined)).toBe(false);
    });
});

describe("capitalizarDescripcion deja la descripción con mayúscula inicial", () => {
    test("una descripción en mayúsculas se rebaja a mayúscula inicial", () => {
        expect(capitalizarDescripcion("GENERAL")).toBe("General");
        expect(capitalizarDescripcion("RECARGO EQUIVALENCIA")).toBe("Recargo equivalencia");
    });

    test("una descripción ya escrita a mano se respeta", () => {
        expect(capitalizarDescripcion("Recargo equivalencia")).toBe("Recargo equivalencia");
        expect(capitalizarDescripcion("Exportaciones")).toBe("Exportaciones");
    });

    test("una descripción en minúsculas solo gana la mayúscula inicial", () => {
        expect(capitalizarDescripcion("exento")).toBe("Exento");
    });

    test("las siglas no se rebajan", () => {
        expect(capitalizarDescripcion("U.E.")).toBe("U.E.");
        expect(capitalizarDescripcion("IVA GENERAL")).toBe("IVA general");
    });

    test("vacío, null y undefined dan cadena vacía", () => {
        expect(capitalizarDescripcion("")).toBe("");
        expect(capitalizarDescripcion(null)).toBe("");
        expect(capitalizarDescripcion(undefined)).toBe("");
    });
});
