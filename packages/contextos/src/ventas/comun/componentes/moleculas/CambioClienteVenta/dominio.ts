import { MetaModelo } from "@olula/lib/dominio.js";
import { CambioCliente } from "./diseño.ts";

export const cambioClienteVacio: CambioCliente = {
    cliente_id: "",
    nombre_cliente: "",
    direccion_id: "",
    id_fiscal: "",
    tipo_via: "",
    nombre_via: "",
    numero: "",
    otros: "",
    cod_postal: "",
    ciudad: "",
    provincia: "",
    pais_id: "",
    apartado: "",
    telefono: "",
};

export const metaCambioCliente: MetaModelo<CambioCliente> = {
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
    }
};

/**
 * Cliente de paso: no hay ids que validar, lo mínimo es el nombre y la vía.
 * El `tipo: "texto"` es lo que hace que un valor vacío invalide el campo.
 */
export const metaCambioClienteNoRegistrado: MetaModelo<CambioCliente> = {
    campos: {
        nombre_cliente: { requerido: true, tipo: "texto" },
        nombre_via: { requerido: true, tipo: "texto" },
    }
};
