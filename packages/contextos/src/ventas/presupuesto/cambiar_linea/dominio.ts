import { MetaModelo } from "@olula/lib/dominio.js";
import { ConTipoArticulo } from "../../venta/diseño.ts";
import { getModeloInicial, metaLineaVenta } from "../../venta/dominio.ts";
import { LineaPresupuesto } from "../diseño.ts";

export type ModeloCambiarLinea = ConTipoArticulo<LineaPresupuesto>;

export { getModeloInicial };

export const metaLinea: MetaModelo<ModeloCambiarLinea> = {
    campos: {
        ...metaLineaVenta.campos,
        grupo_iva_producto_id: { requerido: true },
        iva_incluido: { tipo: "checkbox", requerido: false },
    },
    validacion: (m) => !!(m.referencia || m.descripcion),
};
