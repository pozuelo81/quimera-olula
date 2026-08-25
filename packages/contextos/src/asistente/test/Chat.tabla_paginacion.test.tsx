import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, vi, beforeEach } from "vitest";
import { AsistenteRuntimeProvider } from "#/asistente/vistas/AsistenteRuntimeProvider.tsx";
import { Chat } from "#/asistente/vistas/Chat.tsx";

const filas = Array.from({ length: 15 }, (_, i) => ({ id: `F${i}` }));

const respuestaConTablaGrande = {
    respuesta: "",
    threadId: "hilo-1",
    a2uiMessages: [
        {
            version: "v0.9",
            createSurface: {
                surfaceId: "hilo-1",
                catalogId: "https://a2ui.org/specification/v0_9/basic_catalog.json",
            },
        },
        {
            version: "v0.9",
            updateComponents: {
                surfaceId: "hilo-1",
                components: [
                    { id: "root", component: "Column", children: ["titulo", "tabla"] },
                    { id: "titulo", component: "Text", variant: "h2", text: "Se encontraron 15 facturas." },
                    {
                        id: "tabla",
                        component: "Tabla",
                        columnas: [{ id: "id", cabecera: "ID" }],
                        filas,
                    },
                ],
            },
        },
    ],
    capacidadesHash: null,
    necesitaCapacidades: false,
    accionNavegacion: null,
};

vi.mock("#/asistente/infraestructura.ts", () => ({
    consultarIa: vi.fn(async () => respuestaConTablaGrande),
    consultarIaStream: vi.fn(),
    listarHilos: vi.fn(async () => []),
    obtenerMensajesHilo: vi.fn(async () => ({ threadId: "hilo-1", mensajes: [] })),
}));

beforeEach(() => {
    localStorage.clear();
    globalThis.ResizeObserver ??= class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
    Element.prototype.scrollTo ??= () => {};
});

test("[asistente-tabla-paginacion-01] una tabla con más de 10 filas pagina en el cliente", async () => {
    render(
        <AsistenteRuntimeProvider>
            <Chat />
        </AsistenteRuntimeProvider>
    );

    const textarea = await screen.findByPlaceholderText("Escribe un mensaje…");
    await userEvent.type(textarea, "Dame las facturas");
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

    // Página 1: solo las 10 primeras filas
    await screen.findByText("F0");
    screen.getByText("F9");
    expect(screen.queryByText("F10")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: ">" }));

    // Página 2: las 5 restantes
    await screen.findByText("F10");
    await screen.findByText("F14");
    expect(screen.queryByText("F0")).not.toBeInTheDocument();
});
