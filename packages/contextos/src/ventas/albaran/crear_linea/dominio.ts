import { ModeloNuevaLinea } from "../../venta/diseño.ts";
import { altaLineaDesdeModelo, metaNuevaLinea, nuevaLineaVacia } from "../../venta/dominio.ts";
import { postLinea } from "../infraestructura.ts";

export type { ModeloNuevaLinea };
export { nuevaLineaVacia, metaNuevaLinea };

export const postModelo = async (albaranId: string, linea: ModeloNuevaLinea): Promise<void> => {
    await postLinea(albaranId, altaLineaDesdeModelo(linea));
};
