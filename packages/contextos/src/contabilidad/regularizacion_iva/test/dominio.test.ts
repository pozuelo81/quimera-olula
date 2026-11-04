import { describe, expect, test } from "vitest";
import { NuevaRegularizacionIva } from "../diseño.ts";
import {
    fechasTrimestre,
    periodoNuevaRegularizacion,
    trimestreSiguiente,
} from "../dominio.ts";
import { fechaAApi } from "../infraestructura.ts";

const nueva = (cambios: Partial<NuevaRegularizacionIva> = {}): NuevaRegularizacionIva => ({
    ejercicioId: "2026",
    trimestre: "T2",
    fechaInicio: new Date(2026, 0, 1, 12),
    fechaFin: new Date(2026, 0, 31, 12),
    fechaAsiento: null,
    codigoSubcuentaDeudora: "",
    codigoSubcuentaAcreedora: "",
    ...cambios,
});

describe("regularización de IVA dominio", () => {
    test("las fechas de cada trimestre van del día 1 al último del tercer mes", () => {
        const t1 = fechasTrimestre(2026, "T1");
        expect(fechaAApi(t1.fechaInicio)).toBe("2026-01-01");
        expect(fechaAApi(t1.fechaFin)).toBe("2026-03-31");
        const t2 = fechasTrimestre(2026, "T2");
        expect(fechaAApi(t2.fechaFin)).toBe("2026-06-30");
        const t4 = fechasTrimestre(2026, "T4");
        expect(fechaAApi(t4.fechaInicio)).toBe("2026-10-01");
        expect(fechaAApi(t4.fechaFin)).toBe("2026-12-31");
    });

    test("con trimestre el periodo sale del año del ejercicio y el asiento a fin de periodo", () => {
        const periodo = periodoNuevaRegularizacion(nueva());
        expect(fechaAApi(periodo.fechaInicio)).toBe("2026-04-01");
        expect(fechaAApi(periodo.fechaFin)).toBe("2026-06-30");
        expect(fechaAApi(periodo.fechaAsiento)).toBe("2026-06-30");
    });

    test("con otro periodo se usan las fechas a mano", () => {
        const periodo = periodoNuevaRegularizacion(nueva({
            trimestre: "OTRO",
            fechaAsiento: new Date(2026, 1, 5, 12),
        }));
        expect(fechaAApi(periodo.fechaInicio)).toBe("2026-01-01");
        expect(fechaAApi(periodo.fechaFin)).toBe("2026-01-31");
        expect(fechaAApi(periodo.fechaAsiento)).toBe("2026-02-05");
    });

    test("se propone el primer trimestre sin regularizar del ejercicio", () => {
        const hechas = [
            { ejercicioId: "2026", periodo: "T1" },
            { ejercicioId: "2025", periodo: "T2" },
        ];
        expect(trimestreSiguiente(hechas, "2026")).toBe("T2");
        expect(trimestreSiguiente([], "2026")).toBe("T1");
        expect(trimestreSiguiente(
            ["T1", "T2", "T3", "T4"].map((periodo) => ({ ejercicioId: "2026", periodo })),
            "2026",
        )).toBe("OTRO");
    });
});
