import { VentaTpv } from "#/tpv/venta/diseño.ts";
import { Modelo } from "@olula/lib/diseño.js";
import { MetaModelo } from "@olula/lib/dominio.js";

export type ModeloClienteVentaRegistrado = {
    idCliente: string,
    idDireccion: string,
    nombre: string,
}

export interface ModeloClienteVentaNoRegistrado extends Modelo {
    nombre: string;
    idFiscal: string;
    nombreVia: string;
    tipoVia?: string;
    numero?: string;
    otros?: string;
    codPostal: string;
    ciudad?: string;
    provincia?: string;
    idPais?: string;
    apartado?: string;
    telefono?: string;
}

export const clienteRegistradoVacio: ModeloClienteVentaRegistrado = {
    idCliente: "",
    idDireccion: "",
    nombre: "",
}

export const clienteNoRegistradoDesdeVenta = (venta?: VentaTpv): ModeloClienteVentaNoRegistrado => {

    return venta?.cliente && !venta.cliente.id
        ? {
            nombre: venta.cliente.nombre,
            idFiscal: venta.cliente.idFiscal,
            nombreVia: venta.cliente.direccion.nombre_via,
            codPostal: venta.cliente.direccion.cod_postal,
        }
        : clienteVentaNoRegistradoVacio;
}

export const clienteVentaNoRegistradoVacio: ModeloClienteVentaNoRegistrado = {
    nombre: "",
    idFiscal: "",
    nombreVia: "",
    tipoVia: "",
    numero: "",
    otros: "",
    codPostal: "",
    ciudad: "",
    provincia: "",
    idPais: "",
    apartado: "",
    telefono: "",
}

export const metaModeloClienteVentaRegistrado: MetaModelo<ModeloClienteVentaRegistrado> = {

    campos: {
        idCliente: { requerido: true },
        idDireccion: { requerido: true },
    }
};

export const metaModeloClienteVentaNoRegistrado: MetaModelo<ModeloClienteVentaNoRegistrado> = {

    campos: {
        nombre: { requerido: true },
        idFical: { requerido: true },
        nombreVia: { requerido: true },
    }
};