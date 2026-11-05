import { describe, expect, test } from "vitest";
import { LibroDiario } from "../diseño.ts";
import {
    admiteOpcionesDeDetalle,
    etiquetaLibroDiario,
    libroDiarioVacio,
    metaFormularioLibroDiario,
    nombreFicheroLibroDiario,
    nuevoLibroDiarioInicial,
    opcionesCoherentes,
} from "../dominio.ts";

const ficha = (campos: Partial<LibroDiario> = {}): LibroDiario => ({
    ...libroDiarioVacio(),
    id: "3",
    descripcion: "Diario 2026 completo",
    ejercicioId: "2026",
    ...campos,
});

describe("etiqueta del informe", () => {
    test("usa la descripción y el ejercicio", () => {
        expect(etiquetaLibroDiario(ficha())).toBe(
            "Diario 2026 completo — 2026"
        );
    });

    test("sin descripción cae en el ejercicio", () => {
        expect(etiquetaLibroDiario(ficha({ descripcion: "" }))).toBe(
            "Libro diario 2026"
        );
    });
});

describe("opciones de detalle", () => {
    test("el resumen mensual excluye I.V.A. y agrupar por meses", () => {
        expect(admiteOpcionesDeDetalle({ resumenMensual: true })).toBe(false);
    });

    test("sin resumen mensual ambas opciones están disponibles", () => {
        expect(admiteOpcionesDeDetalle({ resumenMensual: false })).toBe(true);
    });
});

describe("ficha inicial", () => {
    test("arranca con el periodo completo del ejercicio", () => {
        const nuevo = nuevoLibroDiarioInicial("2026");

        expect(nuevo.fechaDesde).toBe("2026-01-01");
        expect(nuevo.fechaHasta).toBe("2026-12-31");
    });

    test("arranca con todos los asientos y todas las subcuentas", () => {
        const nuevo = nuevoLibroDiarioInicial("2026");

        expect(nuevo.todosAsientos).toBe(true);
        expect(nuevo.todasSubcuentas).toBe(true);
        expect(nuevo.orden1).toBe("Asiento");
    });
});

describe("nombre del fichero", () => {
    test("se deriva de la descripción", () => {
        expect(nombreFicheroLibroDiario(ficha())).toBe(
            "diario-2026-completo.pdf"
        );
    });

    test("sin descripción usa el ejercicio", () => {
        expect(nombreFicheroLibroDiario(ficha({ descripcion: "" }))).toBe(
            "libro-diario-2026.pdf"
        );
    });

    test("los acentos no llegan al nombre del fichero", () => {
        expect(
            nombreFicheroLibroDiario(ficha({ descripcion: "Año económico" }))
        ).toBe("ano-economico.pdf");
    });
});

describe("formulario del libro diario", () => {
    test("las opciones booleanas de co_i_diario son casillas", () => {
        const meta = metaFormularioLibroDiario<LibroDiario>();
        for (const campo of [
            "todosAsientos",
            "todasSubcuentas",
            "resumenMensual",
            "datosIva",
            "agruparMeses",
        ]) {
            expect(meta.campos?.[campo]?.tipo).toBe("checkbox");
        }
    });

    test("al marcar resumen mensual apaga datos de I.V.A. y agrupar por meses", () => {
        const meta = metaFormularioLibroDiario<LibroDiario>();
        const resultado = meta.onChange?.(
            ficha({
                resumenMensual: "true" as unknown as boolean,
                datosIva: true,
                agruparMeses: true,
            }),
            "resumenMensual",
            false
        );
        expect(resultado?.resumenMensual).toBe(true);
        expect(resultado?.datosIva).toBe(false);
        expect(resultado?.agruparMeses).toBe(false);
    });

    test("opcionesCoherentes no toca nada sin resumen mensual", () => {
        const informe = ficha({ datosIva: true, agruparMeses: true });
        expect(opcionesCoherentes(informe)).toBe(informe);
    });

    test("sin «todas las subcuentas» desde y hasta son obligatorias", () => {
        const meta = metaFormularioLibroDiario<LibroDiario>();
        const requerido = meta.campos?.subcuentaDesde?.requerido as (
            m: LibroDiario
        ) => boolean;
        expect(requerido(ficha({ todasSubcuentas: false }))).toBe(true);
        expect(requerido(ficha({ todasSubcuentas: true }))).toBe(false);
    });
});
