import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { Articulo } from "../diseño.ts";

export const nuevoArticuloVacio: Partial<Articulo> = {
    descripcion: "",
    grupoIvaProductoId: "",
};

export const metaNuevoArticulo: MetaModelo<Partial<Articulo>> = {
    campos: {
        descripcion: { requerido: true, validacion: (m) => stringNoVacio(m.descripcion || "") },
        grupoIvaProductoId: { requerido: false },
    },
};
