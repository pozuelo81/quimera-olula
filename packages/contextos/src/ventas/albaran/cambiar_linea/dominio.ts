import { MetaModelo } from "@olula/lib/dominio.ts";
import { ConTipoArticulo } from "../../venta/diseño.ts";
import { getModeloInicial, metaLineaVenta } from "../../venta/dominio.ts";
import { LineaAlbaran } from "../diseño.ts";

export type ModeloCambiarLinea = ConTipoArticulo<LineaAlbaran>;

export { getModeloInicial };

export const metaLinea: MetaModelo<ModeloCambiarLinea> = {
    campos: {
        ...metaLineaVenta.campos,
        grupo_iva_producto_id: { requerido: true },
        iva_incluido: { tipo: "checkbox", requerido: false },
    },
    validacion: (m) => !!(m.referencia || m.descripcion),
};
