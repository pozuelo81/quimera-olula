import { TipoArticuloLinea } from "#/ventas/venta/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { getTipoArticulo, metaLineaVenta } from "../../venta/dominio.ts";
import { LineaPedido } from "../diseño.ts";

/**
 * Modelo de edición de línea de pedido.
 *
 * Tipo independiente (sin herencia) que evita el index signature
 * `[clave: string]: unknown` de Entidad, lo que permite a TypeScript
 * inferir correctamente el tipo de cada propiedad al usarlo con useModelo.
 *
 * Contiene todos los campos de LineaPedido necesarios para el PATCH, con
 * dos diferencias respecto al tipo de la API:
 *  - `descripcion` es nullable mientras el editor está abierto.
 *  - Añade `tipoArticulo` y `descripcionArticulo` para gestionar ArticuloLinea.
 */
// export type ModeloCambiarLinea = {
//     // ── Identificación ────────────────────────────────────────────────────
//     id: string;
//     // ── Artículo (gestionados por ArticuloLinea) ──────────────────────────
//     tipoArticulo: "registrado" | "libre" | "generico";
//     referencia: string | null;
//     /** Descripción que muestra el autocomplete del catálogo. */
//     descripcionArticulo: string | null;
//     /** Descripción libre o genérica introducida por el usuario. */
//     descripcion: string | null;
//     // ── Cantidades y precios ──────────────────────────────────────────────
//     cantidad: number;
//     pvp_unitario: number;
//     pvp_total: number;
//     // ── Descuentos ────────────────────────────────────────────────────────
//     dto_porcentual: number;
//     dto_lineal: number;
//     // ── Impuestos (bloqueados; los calcula el servidor) ───────────────────
//     iva_incluido: boolean;
//     grupo_iva_producto_id: string;
//     tipo_iva: number;
//     tipo_recargo: number;
//     // ── IRPF y comisión ───────────────────────────────────────────────────
//     tipo_irpf: number;
//     por_comision: number;
//     importe_comision: number;
//     // ── Campos opcionales de LineaPedido ──────────────────────────────────
//     otro_campo?: string;
// };
export interface ModeloCambiarLinea extends LineaPedido {
    tipoArticulo: TipoArticuloLinea;
}
export const getModeloInicial = (linea: LineaPedido): ModeloCambiarLinea => {
    return {
        ...linea,
        tipoArticulo: getTipoArticulo(linea),
    };
}
/**
 * Infiere el tipoArticulo a partir de la línea recibida de la API:
 * - Tiene referencia → "registrado"; la descripción actual va al catálogo.
 * - Sin referencia   → "libre"; la descripción actual va al campo libre.
 */
// export const lineaAModelo = (linea: LineaPedido): ModeloCambiarLinea => ({
//     id: linea.id,
//     tipoArticulo: linea.referencia ? "registrado" : "libre",
//     referencia: linea.referencia,
//     descripcionArticulo: linea.referencia ? linea.descripcion : null,
//     descripcion: linea.descripcion,
//     cantidad: linea.cantidad,
//     pvp_unitario: linea.pvp_unitario,
//     pvp_total: linea.pvp_total,
//     dto_porcentual: linea.dto_porcentual,
//     dto_lineal: linea.dto_lineal,
//     iva_incluido: linea.iva_incluido,
//     grupo_iva_producto_id: linea.grupo_iva_producto_id,
//     tipo_iva: linea.tipo_iva,
//     tipo_recargo: linea.tipo_recargo,
//     tipo_irpf: linea.tipo_irpf,
//     por_comision: linea.por_comision,
//     importe_comision: linea.importe_comision,
//     ...(linea.otro_campo !== undefined ? { otro_campo: linea.otro_campo } : {}),
// });

/**
 * Reconstruye la descripción plana que espera la API antes del PATCH.
 * - "registrado" → usa la descripción del catálogo (descripcionArticulo).
 * - "generico" y "libre" → usa la descripción editada por el usuario.
 */
// export const modeloALinea = (m: ModeloCambiarLinea): LineaPedido => ({
//     id: m.id,
//     referencia: m.referencia,
//     descripcion:
//         m.tipoArticulo === "registrado"
//             ? (m.descripcionArticulo ?? "")
//             : (m.descripcion ?? ""),
//     cantidad: m.cantidad,
//     pvp_unitario: m.pvp_unitario,
//     pvp_total: m.pvp_total,
//     dto_porcentual: m.dto_porcentual,
//     dto_lineal: m.dto_lineal,
//     iva_incluido: m.iva_incluido,
//     grupo_iva_producto_id: m.grupo_iva_producto_id,
//     tipo_iva: m.tipo_iva,
//     tipo_recargo: m.tipo_recargo,
//     tipo_irpf: m.tipo_irpf,
//     por_comision: m.por_comision,
//     importe_comision: m.importe_comision,
//     ...(m.otro_campo !== undefined ? { otro_campo: m.otro_campo } : {}),
// });

export const metaLinea: MetaModelo<ModeloCambiarLinea> = {
    campos: {
        ...metaLineaVenta.campos,
        // id: { requerido: true },
        // nullable en el modelo: la validación cruzada la hace `validacion`
        // descripcion: { requerido: false, tipo: "texto" },
        grupo_iva_producto_id: { requerido: true },
        iva_incluido: { tipo: "checkbox", requerido: false },
    },
    validacion: (m) => !!(m.referencia || m.descripcion),
};

// export const modeloACambios = (linea: ModeloCambiarLinea): CambiosLineaPedido => ({
//     descripcion: linea.descripcion!,
//     cantidad: linea.cantidad,
//     pvp_unitario: linea.pvp_unitario,
//     dto_porcentual: linea.dto_porcentual,
//     dto_lineal: linea.dto_lineal,
//     iva_incluido: linea.iva_incluido,
//     grupo_iva_producto_id: linea.grupo_iva_producto_id,
//     tipo_irpf: linea.tipo_irpf,
//     por_comision: linea.por_comision,
// })