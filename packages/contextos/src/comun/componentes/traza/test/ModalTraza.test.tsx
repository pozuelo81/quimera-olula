import { ModalTraza } from "#/comun/componentes/traza/ModalTraza.tsx";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { describe, expect, test, vi } from "vitest";

const trazaFactura = {
    factura: {
        tipo: "factura_venta", id: "10", codigo: "F-10", visible: true, fecha: "2026-09-01",
        cliente_id: "C1", nombre_cliente: "Cliente Uno", total: 121, divisa_id: "EUR",
    },
    albaranes: [
        {
            albaran: {
                tipo: "albaran_venta", id: "20", codigo: "A-20", visible: true, fecha: "2026-08-30",
                cliente_id: "C1", nombre_cliente: "Cliente Uno", total: 121, divisa_id: "EUR",
            },
            pedidos: [
                {
                    pedido: { tipo: "pedido_venta", id: "30", codigo: "P-30", visible: false, fecha: null },
                    presupuestos: [],
                },
            ],
        },
    ],
    recibos: [],
};

const DondeEstoy = () => <p>{`ruta: ${useLocation().pathname}${useLocation().search}`}</p>;

const pintar = (onCerrar = vi.fn()) => {
    const getTraza = vi.fn().mockResolvedValue(trazaFactura);

    render(
        <MemoryRouter initialEntries={["/ventas/factura?id=10"]}>
            <Routes>
                <Route path="*" element={<>
                    <ModalTraza id="10" getTraza={getTraza} onCerrar={onCerrar} />
                    <DondeEstoy />
                </>} />
            </Routes>
        </MemoryRouter>
    );

    return { getTraza, onCerrar };
};

const nodo = (nombre: RegExp) => screen.findByRole("button", { name: nombre, hidden: true });

describe("ModalTraza", () => {
    test("pide la traza del documento abierto", async () => {
        const { getTraza } = pintar();

        await nodo(/Factura de venta F-10/);

        expect(getTraza).toHaveBeenCalledWith("10");
    });

    test("empieza con el documento abierto seleccionado, que no se puede volver a abrir", async () => {
        pintar();

        expect(await nodo(/Factura de venta F-10/)).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByText("Documento actual").closest("button")).toBeDisabled();
    });

    test("al seleccionar otro documento se ven sus datos y se puede ir a él", async () => {
        const { onCerrar } = pintar();

        await userEvent.click(await nodo(/Albarán de venta A-20/));

        expect(screen.getByText("C1 · Cliente Uno")).toBeInTheDocument();
        await userEvent.click(screen.getByText("Ver documento"));

        expect(onCerrar).toHaveBeenCalled();
        expect(screen.getByText("ruta: /ventas/albaran?id=20")).toBeInTheDocument();
    });

    test("un documento sin acceso no enseña datos ni se abre", async () => {
        pintar();

        await userEvent.click(await nodo(/Pedido de venta P-30/));

        expect(screen.getByText("No tienes acceso a los datos de este documento.")).toBeInTheDocument();
        expect(screen.getByText("Ver documento").closest("button")).toBeDisabled();
    });

    test("se selecciona un documento con el teclado", async () => {
        pintar();

        const albaran = await nodo(/Albarán de venta A-20/);
        albaran.focus();
        await userEvent.keyboard("{Enter}");

        expect(albaran).toHaveAttribute("aria-pressed", "true");
    });
});
