import { ejercicioActual } from "#/contabilidad/asiento/dominio.ts";
import { conChecks } from "#/contabilidad/comun/checks_informe.ts";
import { subcuentasRequeridas } from "#/contabilidad/comun/rangos_ejercicio.ts";
import { Modelo } from "@olula/lib/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.ts";
import {
    CriterioOrden,
    LibroDiario,
    NuevoLibroDiario,
    SentidoOrden,
} from "./diseño.ts";

export { ejercicioActual };

export const NO_ORDENAR: CriterioOrden = "No ordenar";
export const ASCENDENTE: SentidoOrden = "Ascendente";

export const etiquetaLibroDiario = (
    informe: Pick<LibroDiario, "descripcion" | "ejercicioId">
): string =>
    informe.descripcion
        ? `${informe.descripcion} — ${informe.ejercicioId}`
        : `Libro diario ${informe.ejercicioId}`;

export const libroDiarioVacio = (): LibroDiario => ({
    id: "",
    descripcion: "",
    tipo: "Borrador",
    ejercicioId: "",
    fechaDesde: "",
    fechaHasta: "",
    todosAsientos: true,
    asientoDesde: "",
    asientoHasta: "",
    todasSubcuentas: true,
    subcuentaDesde: "",
    subcuentaHasta: "",
    datosIva: false,
    agruparMeses: false,
    resumenMensual: false,
    orden1: "Asiento",
    tipoOrden1: ASCENDENTE,
    orden2: NO_ORDENAR,
    tipoOrden2: ASCENDENTE,
    orden3: NO_ORDENAR,
    tipoOrden3: ASCENDENTE,
});

/**
 * `controlChecks` del formulario de Eneboo: con resumen mensual marcado, los
 * checks de datos de I.V.A. y agrupar por meses se deshabilitan y se apagan.
 * El backend aplica la misma regla.
 */
export const admiteOpcionesDeDetalle = (
    informe: Pick<LibroDiario, "resumenMensual">
): boolean => !informe.resumenMensual;

/** Campos `bool` de `co_i_diario` que se editan como casilla. */
export const CHECKS_LIBRO_DIARIO = [
    "todosAsientos",
    "todasSubcuentas",
    "resumenMensual",
    "datosIva",
    "agruparMeses",
] as const;

type OpcionesLibroDiario = Pick<
    LibroDiario,
    "resumenMensual" | "datosIva" | "agruparMeses"
>;

/** `controlChecks` de Eneboo: al marcar resumen mensual se apagan datos de
 * I.V.A. y agrupar por meses. */
export const opcionesCoherentes = <T extends OpcionesLibroDiario>(
    informe: T
): T =>
    informe.resumenMensual && (informe.datosIva || informe.agruparMeses)
        ? { ...informe, datosIva: false, agruparMeses: false }
        : informe;

type FormularioLibroDiario = Modelo &
    OpcionesLibroDiario &
    Pick<LibroDiario, "todasSubcuentas">;

/** Meta común del alta y de la ficha: casillas, subcuentas obligatorias sin
 * «todas las subcuentas» y `controlChecks`. */
export const metaFormularioLibroDiario = <
    T extends FormularioLibroDiario,
>(): MetaModelo<T> =>
    conChecks<T>(
        {
            campos: {
                descripcion: { requerido: true },
                ejercicioId: { requerido: true },
                subcuentaDesde: { requerido: subcuentasRequeridas },
                subcuentaHasta: { requerido: subcuentasRequeridas },
            },
        },
        CHECKS_LIBRO_DIARIO,
        opcionesCoherentes
    );

export const nuevoLibroDiarioInicial = (
    ejercicioId: string
): NuevoLibroDiario => ({
    descripcion: "",
    ejercicioId,
    fechaDesde: `${ejercicioId}-01-01`,
    fechaHasta: `${ejercicioId}-12-31`,
    todosAsientos: true,
    asientoDesde: "",
    asientoHasta: "",
    todasSubcuentas: true,
    subcuentaDesde: "",
    subcuentaHasta: "",
    datosIva: false,
    agruparMeses: false,
    resumenMensual: false,
    orden1: "Asiento",
    tipoOrden1: ASCENDENTE,
    orden2: NO_ORDENAR,
    tipoOrden2: ASCENDENTE,
    orden3: NO_ORDENAR,
    tipoOrden3: ASCENDENTE,
});

export const nombreFicheroLibroDiario = (
    informe: Pick<LibroDiario, "descripcion" | "ejercicioId">
): string => {
    const base = (informe.descripcion || `libro diario ${informe.ejercicioId}`)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return `${base || "libro-diario"}.pdf`;
};
