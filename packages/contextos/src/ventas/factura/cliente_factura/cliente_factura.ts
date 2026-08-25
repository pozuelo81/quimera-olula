import { VentaTpv } from "#/tpv/venta/diseño.ts";
import { Modelo } from "@olula/lib/diseño.js";
import { MetaModelo } from "@olula/lib/dominio.js";

export interface ModeloClienteFacturaRegistrado extends Modelo {
    idCliente: string,
    nombre: string,
}

const clienteFacturaRegistradoVacio: ModeloClienteFacturaRegistrado = {
    idCliente: "",
    nombre: "",
}

export const clienteRegistradoDesdeFactura = (venta?: VentaTpv): ModeloClienteFacturaRegistrado => {

    return venta && venta.cliente?.id
        ? {
            idCliente: venta.cliente.id,
            nombre: venta.cliente.nombre,
        }
        : clienteFacturaRegistradoVacio;
}

export const metaModeloClienteFacturaRegistrado: MetaModelo<ModeloClienteFacturaRegistrado> = {

    campos: {
        idCliente: { requerido: true },
    }
};

