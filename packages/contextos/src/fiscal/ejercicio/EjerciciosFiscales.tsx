import { MaestroConDetalleEjercicio } from "#/contabilidad/ejercicio/maestro/MaestroConDetalleEjercicio.tsx";

/** Fiscalidad > Ejercicios fiscales: la tabla `ejercicios` es la misma que la
 * de Contabilidad > Ejercicios, así que se reutiliza su pantalla (alta con
 * PGC nuevo o copiado de otro ejercicio, series, cierre...). */
export const EjerciciosFiscales = () => <MaestroConDetalleEjercicio titulo="Ejercicios fiscales" />;
