import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { empresaInicial } from "../detalle/detalle.ts";
import { DetalleEmpresa } from "../detalle/DetalleEmpresa.tsx";

const patchEmpresa = vi.fn();

const empresa = {
  ...empresaInicial(),
  id: "1",
  nombre: "ACME",
  cifNif: "B12345678",
  administrador: "Juan",
  ejercicioId: "2026",
};

vi.mock("../infraestructura.ts", () => ({
  patchEmpresa: (...args: unknown[]) => patchEmpresa(...args),
  getEmpresa: vi.fn(async () => empresa),
  deleteEmpresa: vi.fn(),
}));

const inputDe = (nombre: string) =>
  document.querySelector(`quimera-input[nombre="${nombre}"] input`) as HTMLInputElement;

describe("Dirección de empresa", () => {
  beforeEach(() => {
    patchEmpresa.mockReset();
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  test("guardar la dirección hace patch", async () => {
    render(<DetalleEmpresa id="1" />);
    await screen.findByText("Dirección sin definir");

    await userEvent.click(screen.getByText("Editar"));
    await userEvent.type(inputDe("nombreVia"), "Mayor");
    await userEvent.click(screen.getByText("Guardar"));

    expect(patchEmpresa).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ nombreVia: "Mayor" })
    );
  });

  test("el modal sigue abierto si el autoguardado del tab se solapa", async () => {
    render(<DetalleEmpresa id="1" />);
    await screen.findByText("Dirección sin definir");

    // Editar un campo del tab deja pendiente el autoguardado, que se dispara
    // con el blur al pulsar Editar. No debe cerrar el modal.
    await userEvent.type(inputDe("nombre"), " SL");
    await userEvent.click(screen.getByText("Editar"));

    expect(screen.queryByText("Guardar")).not.toBeNull();
  });
});
