import { Direccion } from "@olula/lib/diseño.ts";

const texto = (valor: unknown): string =>
    valor === null || valor === undefined ? "" : String(valor).trim();

const unir = (partes: unknown[], separador: string): string =>
    partes.map(texto).filter((p) => p !== "").join(separador);

/**
 * Dirección congelada en el documento, en una línea y sin comas sueltas.
 * La provincia se omite si repite la ciudad.
 */
export const formatearDireccionVenta = (direccion?: Direccion | null): string => {
    if (!direccion) return "";

    // Hay maestros donde el nombre de la vía ya empieza por su tipo ("Calle Mayor").
    const tipoVia = texto(direccion.nombre_via).split(" ")[0]?.toUpperCase() === texto(direccion.tipo_via).toUpperCase()
        ? ""
        : direccion.tipo_via;

    const via = unir([tipoVia, direccion.nombre_via, direccion.numero], " ");
    const poblacion = unir([direccion.cod_postal, direccion.ciudad], " ");
    const provincia = texto(direccion.provincia).toUpperCase() === texto(direccion.ciudad).toUpperCase()
        ? ""
        : direccion.provincia;

    return unir([via, direccion.otros, poblacion, provincia, direccion.pais], ", ");
};

/** Fecha en el formato de día que espera la API (`YYYY-MM-DD`). */
export const fechaAISO = (fecha?: Date | string | null): string | null => {
    if (!fecha) return null;
    if (typeof fecha === "string") return fecha.slice(0, 10);
    return fecha.toISOString().slice(0, 10);
};

/** Hora en el formato que espera la API (`HH:MM:SS`); null si viene vacía. */
export const normalizarHora = (hora?: string | null): string | null => {
    const valor = texto(hora);
    if (valor === "") return null;

    const [horas = "0", minutos = "0", segundos = "0"] = valor.split(":");
    const doble = (n: string) => String(Number(n) || 0).padStart(2, "0");

    return `${doble(horas)}:${doble(minutos)}:${doble(segundos)}`;
};

/**
 * Los checkbox de `useModelo` viajan como cadena ("true"/"false"), así que hay
 * que normalizarlos antes de mandarlos a la API.
 */
export const esVerdadero = (valor: unknown): boolean =>
    valor === true || valor === "true" || valor === "1";

/**
 * Descripción de maestro en mayúscula inicial. Los maestros de cada app las
 * guardan a su manera ("GENERAL", "Recargo equivalencia"), así que se rebaja a
 * minúscula lo que venga en mayúsculas, salvo siglas ("U.E.", "IVA").
 */
export const capitalizarDescripcion = (descripcion?: string | null): string => {
    const valor = texto(descripcion);
    if (valor === "") return "";

    const esSigla = (palabra: string) =>
        palabra.includes(".") || palabra.replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "").length <= 3;

    const palabras = valor.split(" ").map((palabra) =>
        palabra === palabra.toLocaleLowerCase() || esSigla(palabra)
            ? palabra
            : palabra.toLocaleLowerCase()
    );

    const [primera = "", ...resto] = palabras;
    return [primera.charAt(0).toLocaleUpperCase() + primera.slice(1), ...resto].join(" ");
};
