import { Criteria, Entidad, Modelo, RespuestaLista } from "@olula/lib/diseño.ts";

export type EstadoProyecto = 'ABIERTO' | 'CERRADO' | 'EN_CURSO' | 'CANCELADO' | 'SUSPENDIDO';

export const getDescripcionEstado = (estado: EstadoProyecto): string => ({
    ABIERTO: "Abierto",
    EN_CURSO: "En curso",
    SUSPENDIDO: "Suspendido",
    CERRADO: "Cerrado",
    CANCELADO: "Cancelado",
})[estado];

export interface Proyecto extends Entidad {
    id: string;
    nombre: string;
    nombreCompleto: string;
    estado: EstadoProyecto;
    fechaInicio: Date;
    fechaFin: Date | null;
}

export interface NuevoProyecto extends Modelo {
    nombre: string;
    idCliente: string;
    nombreCliente: string;
}

export type CambiosProyecto = Partial<Proyecto>;

export type GetProyecto = (id: string) => Promise<Proyecto>;
export type GetProyectos = (criteria: Criteria) => RespuestaLista<Proyecto>;
export type PostProyecto = (nuevoProyecto: NuevoProyecto) => Promise<string>;
export type PatchProyecto = (id: string, cambios: CambiosProyecto) => Promise<void>;
export type DeleteProyecto = (id: string) => Promise<void>;
