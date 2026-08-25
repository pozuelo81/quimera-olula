import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi, beforeEach } from "vitest";
import { AsistenteRuntimeProvider } from "#/asistente/vistas/AsistenteRuntimeProvider.tsx";
import { Chat } from "#/asistente/vistas/Chat.tsx";

const respuestaConTarjetaMetrica = {
    respuesta: "El importe total de los presupuestos pendientes de aprobar en 2026 es de 21.534,68 €.",
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
                    {
                        id: "root",
                        component: "TarjetaMetrica",
                        titulo: "Total presupuestos pendientes de aprobar 2026",
                        valor: "21.534,68 €",
                        detalle: "18 presupuestos tenidos en cuenta",
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
    consultarIa: vi.fn(async () => respuestaConTarjetaMetrica),
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

test("[asistente-metrica-01] una pregunta agregada muestra la TarjetaMetrica con título, valor y detalle", async () => {
    render(
        <AsistenteRuntimeProvider>
            <Chat />
        </AsistenteRuntimeProvider>
    );

    const textarea = await screen.findByPlaceholderText("Escribe un mensaje…");
    await userEvent.type(textarea, "dime el total de presupuestos de 2026 pendientes de aprobar");
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

    await screen.findByText("Total presupuestos pendientes de aprobar 2026");
    await screen.findByText("21.534,68 €");
    await screen.findByText("18 presupuestos tenidos en cuenta");
});

test("[asistente-metrica-02] la burbuja de texto del LLM se oculta cuando ya hay una TarjetaMetrica", async () => {
    render(
        <AsistenteRuntimeProvider>
            <Chat />
        </AsistenteRuntimeProvider>
    );

    const textarea = await screen.findByPlaceholderText("Escribe un mensaje…");
    await userEvent.type(textarea, "dime el total de presupuestos de 2026 pendientes de aprobar");
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

    // La tarjeta debe verse...
    await screen.findByText("21.534,68 €");
    // ...pero el texto del LLM que la acompaña (redundante con la propia tarjeta) no
    // debe renderizarse.
    expect(screen.queryByText(/El importe total/)).not.toBeInTheDocument();
});
