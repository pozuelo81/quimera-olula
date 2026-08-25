import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, vi, beforeEach } from "vitest";
import { AsistenteRuntimeProvider } from "#/asistente/vistas/AsistenteRuntimeProvider.tsx";
import { Chat } from "#/asistente/vistas/Chat.tsx";

const respuestaConNegrita = {
    respuesta: "El importe total de los presupuestos pendientes de aprobar en 2026 es de **21.534,68 €**.",
    threadId: "hilo-1",
    a2uiMessages: [],
    capacidadesHash: null,
    necesitaCapacidades: false,
    accionNavegacion: null,
};

vi.mock("#/asistente/infraestructura.ts", () => ({
    consultarIa: vi.fn(async () => respuestaConNegrita),
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

test("[asistente-negrita-01] **texto** del LLM se muestra en negrita real, sin los asteriscos", async () => {
    const { container } = render(
        <AsistenteRuntimeProvider>
            <Chat />
        </AsistenteRuntimeProvider>
    );

    const textarea = await screen.findByPlaceholderText("Escribe un mensaje…");
    await userEvent.type(textarea, "dime el total pendiente");
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

    const negrita = await screen.findByText("21.534,68 €", { selector: "strong" });
    // El texto alrededor se conserva tal cual, sin los "**" literales
    await screen.findByText(/El importe total.*es de/);
    expect(container.textContent).not.toContain("**");
    expect(negrita.tagName).toBe("STRONG");
});
