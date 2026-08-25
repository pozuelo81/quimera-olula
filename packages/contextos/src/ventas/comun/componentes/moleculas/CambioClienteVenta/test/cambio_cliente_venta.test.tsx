import { MetaModelo } from "@olula/lib/dominio.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMemo } from "react";
import { describe, expect, test, vi } from "vitest";
import { CambioClienteVenta, VentaConCliente } from "../CambioClienteVenta.tsx";
import { CambioCliente } from "../diseño.ts";

vi.mock("#/comun/componentes/pais/pais.tsx", () => ({
  PaisSelector: () => null,
}));

const metaVentaConCliente: MetaModelo<VentaConCliente> = { campos: {} };

const ventaConClienteDePaso = (): VentaConCliente => ({
  id: "DOC001",
  cliente: {
    cliente_id: null,
    nombre_cliente: "Cliente de paso",
    id_fiscal: "B12345678",
    direccion_id: null,
    direccion: {
      nombre_via: "Gran Vía",
      tipo_via: "Calle",
      numero: "5",
      otros: "",
      cod_postal: "18001",
      ciudad: "Granada",
      provincia_id: 18,
      provincia: "Granada",
      pais_id: "ES",
      apartado: "",
      telefono: "958000000",
    },
  },
});

const Anfitrion = ({
  onGuardar,
}: {
  onGuardar: (cambios: CambioCliente) => Promise<void>;
}) => {
  const inicial = useMemo(ventaConClienteDePaso, []);

  const venta: HookModelo<VentaConCliente> = useModelo(
    metaVentaConCliente,
    inicial
  );

  return <CambioClienteVenta venta={venta} onGuardar={onGuardar} />;
};

describe("Cambio de cliente y dirección con cliente no registrado", () => {
  test("conserva lo escrito al salir del campo", async () => {
    render(<Anfitrion onGuardar={async () => {}} />);

    const ciudad = await screen.findByLabelText(/Ciudad/);
    await userEvent.clear(ciudad);
    await userEvent.type(ciudad, "Motril");
    await userEvent.tab();

    expect(ciudad).toHaveValue("Motril");
  });

  test("guarda los doce campos del cliente de paso, sin provincia_id", async () => {
    const onGuardar = vi.fn(async (_cambios: CambioCliente) => {});
    render(<Anfitrion onGuardar={onGuardar} />);

    const ciudad = await screen.findByLabelText(/Ciudad/);
    await userEvent.clear(ciudad);
    await userEvent.type(ciudad, "Motril");

    await userEvent.click(screen.getByText("Guardar"));

    expect(onGuardar).toHaveBeenCalledWith({
      nombre_cliente: "Cliente de paso",
      id_fiscal: "B12345678",
      tipo_via: "Calle",
      nombre_via: "Gran Vía",
      numero: "5",
      otros: "",
      cod_postal: "18001",
      ciudad: "Motril",
      provincia: "Granada",
      pais_id: "ES",
      apartado: "",
      telefono: "958000000",
    });
    expect(onGuardar.mock.calls[0][0]).not.toHaveProperty("provincia_id");
  });

  test("no deja guardar sin nombre de la vía", async () => {
    render(<Anfitrion onGuardar={async () => {}} />);

    const nombreVia = await screen.findByLabelText(/Nombre de la Vía/);
    await userEvent.clear(nombreVia);
    await userEvent.tab();

    expect(screen.getByText("Guardar").closest("quimera-boton")).toHaveAttribute(
      "deshabilitado"
    );
  });
});
