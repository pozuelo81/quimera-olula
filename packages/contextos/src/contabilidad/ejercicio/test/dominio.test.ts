import { describe, expect, test } from "vitest";
import { Ejercicio } from "../diseño.ts";
import {
    asientosDelEjercicio,
    ejercicioSiguiente,
    ejercicioVacio,
    esAvisoCuentasSinCodigoBalance,
    nuevoEjercicioPropuesto,
    opcionesCierreIniciales,
    puedeCerrar,
    puedeDeshacerCierre,
    puedeGenerarPgc,
    seriesDesdeTexto,
    textoAviso,
    urlAsiento,
} from "../dominio.ts";
import { fechaAApi } from "../infraestructura.ts";

const ejercicio = (id: string, anyo: number, cambios: Partial<Ejercicio> = {}): Ejercicio => ({
    ...ejercicioVacio(),
    id,
    nombre: `EJERCICIO ${id}`,
    empresaId: 1,
    fechaInicio: new Date(anyo, 0, 1, 12),
    fechaFin: new Date(anyo, 11, 31, 12),
    tienePgc: true,
    ...cambios,
});

describe("ejercicios: alta", () => {
    test("propone el ejercicio siguiente copiando el PGC del último", () => {
        const propuesto = nuevoEjercicioPropuesto([ejercicio("2025", 2025), ejercicio("2026", 2026)]);
        expect(propuesto.id).toBe("2027");
        expect(propuesto.nombre).toBe("EJERCICIO 2027");
        expect(fechaAApi(propuesto.fechaInicio)).toBe("2027-01-01");
        expect(fechaAApi(propuesto.fechaFin)).toBe("2027-12-31");
        expect(propuesto.ejercicioOrigenPgc).toBe("2026");
    });

    test("sin ejercicios propone el año en curso y PGC nuevo", () => {
        const propuesto = nuevoEjercicioPropuesto([]);
        expect(propuesto.id).toBe(String(new Date().getFullYear()));
        expect(propuesto.ejercicioOrigenPgc).toBe("");
        expect(propuesto.digitosSubcuenta).toBe(10);
    });

    test("las series se separan por comas o espacios", () => {
        expect(seriesDesdeTexto("A, B  R")).toEqual(["A", "B", "R"]);
        expect(seriesDesdeTexto("")).toEqual([]);
    });
});

describe("ejercicios: cierre", () => {
    test("acciones según el estado", () => {
        expect(puedeGenerarPgc(ejercicio("2026", 2026))).toBe(false);
        expect(puedeGenerarPgc(ejercicio("2027", 2027, { tienePgc: false }))).toBe(true);
        expect(puedeCerrar(ejercicio("2026", 2026))).toBe(true);
        expect(puedeCerrar(ejercicio("2026", 2026, { estado: "CERRADO" }))).toBe(false);
        expect(puedeDeshacerCierre(ejercicio("2026", 2026))).toBe(false);
        expect(puedeDeshacerCierre(ejercicio("2026", 2026, { estado: "CERRADO" }))).toBe(true);
        expect(puedeDeshacerCierre(ejercicio("2026", 2026, { asientoPygId: 7 }))).toBe(true);
    });

    test("asientos del ejercicio: apertura, regularización y cierre, los que haya (A4)", () => {
        expect(asientosDelEjercicio(ejercicio("2026", 2026))).toEqual([]);

        const cerrado = ejercicio("2026", 2026, {
            estado: "CERRADO", asientoAperturaId: 3, asientoPygId: 7, asientoCierreId: 8,
        });
        expect(asientosDelEjercicio(cerrado)).toEqual([
            { tipo: "APERTURA", titulo: "Asiento de apertura", asientoId: "3" },
            { tipo: "REGULARIZACION", titulo: "Asiento de regularización (pérdidas y ganancias)", asientoId: "7" },
            { tipo: "CIERRE", titulo: "Asiento de cierre", asientoId: "8" },
        ]);

        const regularizado = ejercicio("2026", 2026, { asientoPygId: 7 });
        expect(asientosDelEjercicio(regularizado).map((a) => a.tipo)).toEqual(["REGULARIZACION"]);
    });

    test("«Ir a ver asiento» abre Contabilidad > Asientos filtrado por su ejercicio", () => {
        expect(urlAsiento("42", "2027")).toBe("/contabilidad/asiento?id=42&ejercicio_id=eq__2027");
        expect(urlAsiento("42", "")).toBe("/contabilidad/asiento?id=42");
    });

    test("la apertura va al primer ejercicio posterior, o se crea", () => {
        const e26 = ejercicio("2026", 2026);
        const lista = [e26, ejercicio("2028", 2028), ejercicio("2027", 2027)];
        expect(ejercicioSiguiente(e26, lista)).toBe("2027");
        expect(ejercicioSiguiente(e26, [e26])).toBe("");
    });

    test("opciones iniciales: fecha de fin y solo los asientos que faltan", () => {
        const e26 = ejercicio("2026", 2026, { asientoPygId: 5 });
        const opciones = opcionesCierreIniciales(e26, [e26]);
        expect(fechaAApi(opciones.fecha)).toBe("2026-12-31");
        expect(opciones.regularizar).toBe(false);
        expect(opciones.cerrar).toBe(true);
        expect(opciones.abrir).toBe(true);
    });

    test("reconoce el aviso de cuentas sin código de balance", () => {
        const error = { estado: 409, descripcion: "CUENTAS_SIN_CODIGO_BALANCE: Algunas subcuentas..." };
        expect(esAvisoCuentasSinCodigoBalance(error)).toBe(true);
        expect(textoAviso(error)).toBe("Algunas subcuentas...");
        expect(esAvisoCuentasSinCodigoBalance({ estado: 409, descripcion: "otro" })).toBe(false);
        expect(esAvisoCuentasSinCodigoBalance({ estado: 400, descripcion: "CUENTAS_SIN_CODIGO_BALANCE" })).toBe(false);
    });
});
