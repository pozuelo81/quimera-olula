import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const getPaises = vi.fn(async (_filtro: unknown, _orden: unknown) => ({
  datos: [{ id: "ES", nombre: "ESPAÑA" }],
  total: 1,
}));

vi.mock("#/comun/componentes/pais/infraestructura.ts", () => ({
  getPaises: (filtro: unknown, orden: unknown) => getPaises(filtro, orden),
}));

const { PaisSelector } = await import("#/comun/componentes/pais/pais.tsx");

const filtroUsado = () => getPaises.mock.calls[0][0];

describe("PaisSelector con un país ya guardado", () => {
  beforeEach(() => getPaises.mockClear());

  test("resuelve el nombre a partir del id y lo muestra", async () => {
    render(<PaisSelector valor="ES" onChange={() => {}} />);

    await waitFor(() => expect(getPaises).toHaveBeenCalled());

    expect(filtroUsado()).toEqual([["id", "=", "ES"]]);
    await waitFor(() =>
      expect(screen.getByDisplayValue("ESPAÑA")).toBeTruthy()
    );
  });

  test("sin valor no consulta: espera a que se teclee", () => {
    render(<PaisSelector valor="" onChange={() => {}} />);

    expect(getPaises).not.toHaveBeenCalled();
  });
});
