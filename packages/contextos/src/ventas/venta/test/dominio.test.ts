import {
    payloadCambioCliente,
    DIVISA_EMPRESA,
    enDivisaExtranjera,
    formatearTasaConversion,
    grupoIvaNegocioEnDocumento,
    metaLineaVenta,
    mostrarImporte,
    puedeCambiarDivisa,
} from "#/ventas/venta/dominio.ts";
import { altaLineaApi } from "#/ventas/venta/infraestructura.ts";
import { LineaVenta } from "#/ventas/venta/diseño.ts";
import { modeloEsEditable, modeloEsValido } from "@olula/lib/dominio.ts";
import { afterEach, describe, expect, test } from "vitest";

describe("mostrarImporte solo muestra importes distintos de cero", () => {
    test("un importe distinto de cero se muestra", () => {
        expect(mostrarImporte(12.5)).toBe(true);
        expect(mostrarImporte(-3)).toBe(true);
    });

    test("cero, null y undefined no se muestran", () => {
        expect(mostrarImporte(0)).toBe(false);
        expect(mostrarImporte(null)).toBe(false);
        expect(mostrarImporte(undefined)).toBe(false);
    });
});

describe("enDivisaExtranjera decide si hay que convertir a la divisa de la empresa", () => {
    test("una divisa distinta de la de la empresa es extranjera", () => {
        expect(enDivisaExtranjera({ divisa_id: "USD" })).toBe(true);
    });

    test(`${DIVISA_EMPRESA} no es extranjera, en cualquier caja`, () => {
        expect(enDivisaExtranjera({ divisa_id: "EUR" })).toBe(false);
        expect(enDivisaExtranjera({ divisa_id: " eur " })).toBe(false);
    });

    test("una divisa vacía no es extranjera", () => {
        expect(enDivisaExtranjera({ divisa_id: "" })).toBe(false);
    });
});

describe("formatearTasaConversion", () => {
    test("usa formato español con cuatro decimales", () => {
        expect(formatearTasaConversion(1.085)).toBe("×1,0850");
        expect(formatearTasaConversion(1)).toBe("×1,0000");
    });
});

describe("campos fiscales de la línea de venta", () => {
    const editable = modeloEsEditable(metaLineaVenta);
    const linea = {} as Parameters<typeof editable>[0];

    test("dto_lineal, tipo_irpf y por_comision son editables", () => {
        expect(editable(linea, "dto_lineal")).toBe(true);
        expect(editable(linea, "tipo_irpf")).toBe(true);
        expect(editable(linea, "por_comision")).toBe(true);
    });

    test("tipo_recargo e importe_comision son de solo lectura", () => {
        expect(editable(linea, "tipo_recargo")).toBe(false);
        expect(editable(linea, "importe_comision")).toBe(false);
    });
});

describe("puedeCambiarDivisa solo deja tocar la divisa con el documento vacío", () => {
    test("sin ninguna línea se puede cambiar", () => {
        expect(puedeCambiarDivisa({ lineas: [] })).toBe(true);
    });

    test("con una línea ya no", () => {
        expect(puedeCambiarDivisa({ lineas: [{}] })).toBe(false);
    });

    test("un documento cuyas líneas aún no han llegado cuenta como vacío", () => {
        expect(puedeCambiarDivisa({})).toBe(true);
    });
});

describe("grupoIvaNegocioEnDocumento oculta el grupo solo en legacy", () => {
    const conIvaNav = (valor: string) =>
        localStorage.setItem("whoami", JSON.stringify({ plugins: { iva_nav: valor } }));

    afterEach(() => localStorage.removeItem("whoami"));

    test("legacy no lleva grupo en el documento", () => {
        conIvaNav("legacy");
        expect(grupoIvaNegocioEnDocumento()).toBe(false);
    });

    test("el resto de variantes sí lo llevan", () => {
        for (const valor of ["activo", "base", "inactivo", "sin_regimen_en_ventas", "NoConfigurado"]) {
            conIvaNav(valor);
            expect(grupoIvaNegocioEnDocumento()).toBe(true);
        }
    });

    test("sin whoami se muestra el grupo", () => {
        expect(grupoIvaNegocioEnDocumento()).toBe(true);
    });
});

describe("validez de la línea sin artículo de catálogo", () => {
    const valido = modeloEsValido(metaLineaVenta);

    const linea = (cambios: Partial<LineaVenta>): LineaVenta => ({
        id: "lin-1",
        referencia: null,
        descripcion: "Mano de obra",
        descripcionArticulo: null,
        cantidad: 1,
        pvp_unitario: 0,
        dto_porcentual: 0,
        dto_lineal: 0,
        pvp_total: 0,
        iva_incluido: false,
        grupo_iva_producto_id: "GEN",
        tipo_irpf: 0,
        tipo_recargo: 0,
        tipo_iva: 21,
        por_comision: 0,
        importe_comision: 0,
        ...cambios,
    });

    test("una línea sin referencia se puede guardar", () => {
        expect(valido(linea({ referencia: null }))).toBe(true);
        expect(valido(linea({ referencia: "" }))).toBe(true);
    });

    test("con referencia sigue siendo válida", () => {
        expect(valido(linea({ referencia: "ART-001" }))).toBe(true);
    });

    test("pero sin descripción no: la línea se queda sin identidad", () => {
        expect(valido(linea({ referencia: null, descripcion: "" }))).toBe(false);
    });
});

describe("altaLineaApi serializa el alta de línea igual para los cuatro documentos", () => {
    test("la línea de catálogo va como articulo.articulo_id, con la cantidad fuera", () => {
        expect(altaLineaApi({ articulo: { articuloId: "ART-001" }, cantidad: 3 })).toEqual({
            articulo: { articulo_id: "ART-001" },
            cantidad: 3,
        });
    });

    test("la línea libre va como articulo.descripcion y pvp_unitario", () => {
        expect(
            altaLineaApi({ articulo: { descripcion: "Portes", pvpUnitario: 15 }, cantidad: 1 })
        ).toEqual({
            articulo: { descripcion: "Portes", pvp_unitario: 15 },
            cantidad: 1,
        });
    });

    test("un pvp de 0 se manda tal cual", () => {
        expect(
            altaLineaApi({ articulo: { descripcion: "Muestra", pvpUnitario: 0 }, cantidad: 2 })
        ).toEqual({
            articulo: { descripcion: "Muestra", pvp_unitario: 0 },
            cantidad: 2,
        });
    });
});

describe("payloadCambioCliente bifurca según haya cliente de maestro o de paso", () => {
    test("con cliente_id manda solo el par de ids", () => {
        expect(
            payloadCambioCliente({ cliente_id: "CLI-1", direccion_id: "DIR-1" })
        ).toEqual({ cliente_id: "CLI-1", direccion_id: "DIR-1" });
    });

    test("sin cliente_id manda el nombre y la dirección anidada", () => {
        expect(
            payloadCambioCliente({
                nombre_cliente: "Cliente de paso",
                id_fiscal: "B12345678",
                tipo_via: "Calle",
                nombre_via: "Gran Vía",
                numero: "5",
                cod_postal: "18001",
                ciudad: "Granada",
                provincia: "Granada",
                pais_id: "ES",
                telefono: "958000000",
            })
        ).toEqual({
            nombre: "Cliente de paso",
            id_fiscal: "B12345678",
            direccion: {
                nombre_via: "Gran Vía",
                tipo_via: "Calle",
                numero: "5",
                otros: null,
                cod_postal: "18001",
                ciudad: "Granada",
                provincia_id: null,
                provincia: "Granada",
                pais_id: "ES",
                apartado: null,
                telefono: "958000000",
            },
        });
    });

    test("la clave del nombre es `nombre`, no `nombre_cliente`", () => {
        const payload = payloadCambioCliente({ nombre_cliente: "Paso" });

        expect(payload).not.toHaveProperty("nombre_cliente");
        expect(payload).toHaveProperty("nombre", "Paso");
    });
});
