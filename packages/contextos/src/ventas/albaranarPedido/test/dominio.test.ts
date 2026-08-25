import { LineaAlbaranarPedido, Tramo } from "#/ventas/albaranarPedido/diseño.ts";
import {
    calcularAEnviar,
    lineaAprobadaCompleta,
    transformarLineasAlbaran,
} from "#/ventas/albaranarPedido/dominio.ts";
import { describe, expect, test } from "vitest";

const linea = (cambios: Partial<LineaAlbaranarPedido> = {}): LineaAlbaranarPedido => ({
    id: "lin-1",
    referencia: "ART1",
    descripcion: "Artículo 1",
    descripcionArticulo: null,
    cantidad: 10,
    pvp_unitario: 5,
    pvp_total: 50,
    dto_porcentual: 0,
    dto_lineal: 0,
    iva_incluido: false,
    grupo_iva_producto_id: "GENERAL",
    tipo_irpf: 0,
    tipo_recargo: 0,
    tipo_iva: 21,
    por_comision: 0,
    importe_comision: 0,
    ...cambios,
});

const tramo = (cantidad: number, id = "tra-1"): Tramo => ({ id, cantidad });

describe("calcularAEnviar decide entre los tramos y la cantidad suelta", () => {
    test("sin tramos manda a_enviar", () => {
        expect(calcularAEnviar(linea({ a_enviar: 4 }))).toBe(4);
    });

    test("sin tramos y sin a_enviar no se envía nada", () => {
        expect(calcularAEnviar(linea())).toBe(0);
    });

    test("con tramos se suman sus cantidades", () => {
        const conTramos = linea({ tramos: [tramo(3, "t1"), tramo(2, "t2")] });
        expect(calcularAEnviar(conTramos)).toBe(5);
    });

    test("los tramos mandan sobre a_enviar cuando existen", () => {
        const conTramos = linea({ a_enviar: 99, tramos: [tramo(3)] });
        expect(calcularAEnviar(conTramos)).toBe(3);
    });

    test("una lista de tramos vacía se comporta como si no hubiera tramos", () => {
        expect(calcularAEnviar(linea({ a_enviar: 4, tramos: [] }))).toBe(4);
    });

    test("un tramo con cantidad ilegible cuenta como cero", () => {
        const conBasura = linea({
            tramos: [tramo(3, "t1"), { id: "t2", cantidad: "dos" as unknown as number }],
        });
        expect(calcularAEnviar(conBasura)).toBe(3);
    });
});

describe("lineaAprobadaCompleta comprueba si la línea queda servida del todo", () => {
    test("lo pendiente más lo ya servido cubre la cantidad", () => {
        expect(lineaAprobadaCompleta(linea({ cantidad: 10, servida: 6, a_enviar: 4 }))).toBe(true);
    });

    test("cubrirla de sobra también cuenta", () => {
        expect(lineaAprobadaCompleta(linea({ cantidad: 10, servida: 6, a_enviar: 7 }))).toBe(true);
    });

    test("quedarse corto no", () => {
        expect(lineaAprobadaCompleta(linea({ cantidad: 10, servida: 6, a_enviar: 3 }))).toBe(false);
    });

    test("lo ya servido puede completarla sin enviar nada más", () => {
        expect(lineaAprobadaCompleta(linea({ cantidad: 10, servida: 10 }))).toBe(true);
    });

    test("una línea sin cantidad nunca está completa", () => {
        expect(lineaAprobadaCompleta(linea({ cantidad: 0, servida: 5, a_enviar: 5 }))).toBe(false);
    });

    test("los tramos cuentan igual que a_enviar", () => {
        const conTramos = linea({ cantidad: 10, servida: 6, tramos: [tramo(2, "t1"), tramo(2, "t2")] });
        expect(lineaAprobadaCompleta(conTramos)).toBe(true);
    });
});

describe("transformarLineasAlbaran arma el patch que viaja al servidor", () => {
    test("una línea sin tramos viaja con su a_enviar", () => {
        expect(transformarLineasAlbaran([linea({ id: "l1", a_enviar: 4 })])).toEqual([
            { id: "l1", cantidad: 4, lotes: [] },
        ]);
    });

    test("una línea con tramos viaja con la suma de los tramos", () => {
        const conTramos = linea({ id: "l1", a_enviar: 99, tramos: [tramo(3, "t1"), tramo(2, "t2")] });
        expect(transformarLineasAlbaran([conTramos])).toEqual([
            { id: "l1", cantidad: 5, lotes: [] },
        ]);
    });

    test("las líneas que no envían nada se quedan fuera", () => {
        const lineas = [
            linea({ id: "l1", a_enviar: 4 }),
            linea({ id: "l2", a_enviar: 0 }),
            linea({ id: "l3" }),
        ];
        expect(transformarLineasAlbaran(lineas).map((l) => l.id)).toEqual(["l1"]);
    });

    test("unos tramos que suman cero también dejan la línea fuera", () => {
        const conTramos = linea({ id: "l1", a_enviar: 5, tramos: [tramo(0)] });
        expect(transformarLineasAlbaran([conTramos])).toEqual([]);
    });

    test("sin líneas no hay patch", () => {
        expect(transformarLineasAlbaran([])).toEqual([]);
    });
});
