import { LineaAlbaranarPedido, LineasAlabaranPatch, Tramo } from "./diseño.ts";

export const transformarLineasAlbaran = (lineas: LineaAlbaranarPedido[]): LineasAlabaranPatch[] => {
    const cantidadDesdeTramos = (tramos?: Tramo[]) =>
        (tramos || []).reduce((acc, tramo) => acc + (Number(tramo.cantidad) || 0), 0);

    return lineas
        .map<LineasAlabaranPatch>(linea => {
            const cantidad = linea.tramos && linea.tramos.length > 0
                ? cantidadDesdeTramos(linea.tramos)
                : (linea.a_enviar || 0);
            return {
                id: linea.id,
                cantidad,
                lotes: [] as []
            };
        })
        .filter(linea => linea.cantidad > 0);
}

export const calcularAEnviar = (linea: LineaAlbaranarPedido): number => {
    const tramos = linea.tramos ?? [];
    return tramos.length > 0
        ? tramos.reduce((total, tramo) => total + (Number(tramo.cantidad) || 0), 0)
        : (linea.a_enviar || 0);
};

export const lineaAprobadaCompleta = (linea: LineaAlbaranarPedido): boolean => {
    const aEnviar = calcularAEnviar(linea);
    return linea.cantidad > 0 && aEnviar + (linea.servida || 0) >= linea.cantidad;
};
