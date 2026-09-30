import { RestAPI } from "@olula/lib/api/rest_api.ts";

/** Traza de un documento: `urlDocumento` es su url en la API, p. ej. `/ventas/factura/10`. */
export const getTraza = async (urlDocumento: string): Promise<unknown> =>
    RestAPI.get<{ datos: unknown }>(`${urlDocumento}/traza`).then((respuesta) => respuesta.datos);
