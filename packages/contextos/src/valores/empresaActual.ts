type WhoAmI = {
    empresas?: { id: string; nombre: string }[];
};

/**
 * Empresa con la que trabaja el usuario: la primera que le devuelve el whoami.
 *
 * Se lee de localStorage en cada llamada, no al cargar el módulo: el login hace
 * `navigate("/")` sin recargar, así que cualquier valor capturado al importar se
 * quedaría congelado con lo de antes de iniciar sesión.
 */
export const empresaActual = (): string => {
    const raw = localStorage.getItem("whoami");
    if (!raw) return "";

    try {
        const whoAmI = JSON.parse(raw) as WhoAmI;
        return whoAmI.empresas?.[0]?.id ?? "";
    } catch {
        return "";
    }
};
