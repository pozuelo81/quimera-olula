import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

export type EstadoEjercicio = "ABIERTO" | "CERRADO";

/** Tabla `ejercicios` vista desde la contabilidad. */
export interface Ejercicio extends Entidad {
    id: string;
    nombre: string;
    empresaId: number | null;
    fechaInicio: Date;
    fechaFin: Date;
    estado: EstadoEjercicio;
    digitosSubcuenta: number;
    planContable: string;
    tienePgc: boolean;
    asientoAperturaId: number | null;
    asientoPygId: number | null;
    asientoCierreId: number | null;
}

/** Alta del ejercicio y de su plan contable. `ejercicioOrigenPgc` vacío
 * genera el PGC 2008 estándar. */
export interface NuevoEjercicio extends Modelo {
    id: string;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    digitosSubcuenta: number;
    ejercicioOrigenPgc: string;
    series: string;
}

export interface GenerarPgc extends Modelo {
    ejercicioOrigenId: string;
    digitosSubcuenta: number;
}

/** Las casillas del formulario de cierre de Eneboo (co_cerrarejer). */
export interface OpcionesCierre extends Modelo {
    fecha: Date;
    regularizar: boolean;
    cerrar: boolean;
    abrir: boolean;
    ejercicioDestinoId: string;
    ignorarCuentasSinCodigoBalance: boolean;
}

export interface ResultadoCierre {
    asientoPygId: number | null;
    asientoCierreId: number | null;
    asientoAperturaId: number | null;
    ejercicioDestinoId: string | null;
    ejercicioDestinoCreado: boolean;
}

/** Un asiento que el cierre deja enlazado al ejercicio, con su título. */
export interface AsientoDelEjercicio {
    titulo: string;
    asientoId: string;
}

export type GetEjercicios = (criteria: Criteria) => RespuestaLista<Ejercicio>;
export type GetEjercicio = (id: string) => Promise<Ejercicio>;

/** Cabecera editable de `ejercicios.ui` (Fiscalidad > Ejercicios fiscales). */
export interface DatosEjercicio extends Modelo {
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    digitosSubcuenta: number;
}

/** Fila de `secuenciasejercicios` (pestaña Series de `ejercicios.ui`). */
export interface SerieEjercicio extends Entidad {
    id: string;
    serieId: string;
    descripcion: string;
}
