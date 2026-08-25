export const fechaDesdeApi = (valor: string | null | undefined): Date | null =>
    valor ? new Date(valor) : null;
