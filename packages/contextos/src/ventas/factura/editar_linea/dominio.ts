import { ConTipoArticulo } from "../../venta/diseño.ts";
import { getModeloInicial, metaLineaVenta } from "../../venta/dominio.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { LineaFactura } from "../diseño.ts";

export type ModeloCambiarLinea = ConTipoArticulo<LineaFactura>;

export { getModeloInicial };

export const metaLinea: MetaModelo<ModeloCambiarLinea> = {
    campos: {
        ...metaLineaVenta.campos,
        grupo_iva_producto_id: { requerido: true },
        iva_incluido: { tipo: "checkbox", requerido: false },
        tipo_irpf: { tipo: "decimal", requerido: false, decimales: 2 },
        por_comision: { tipo: "decimal", requerido: false, decimales: 2 },
    },
    validacion: (m) => !!(m.referencia || m.descripcion),
};
