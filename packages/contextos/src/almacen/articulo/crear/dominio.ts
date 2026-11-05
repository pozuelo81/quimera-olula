import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { NuevoArticulo } from "../diseño.ts";

export const nuevoArticuloVacio: NuevoArticulo = {
    descripcion: "",
    grupoIvaProductoId: "",
};

export const metaNuevoArticulo: MetaModelo<NuevoArticulo> = {
    campos: {
        descripcion: { requerido: true, validacion: (m) => stringNoVacio(m.descripcion || "") },
        grupoIvaProductoId: { requerido: false },
    },
};
