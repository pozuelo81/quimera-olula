import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

export interface Remesa extends Entidad {
    id: string;
    fecha: Date | null;
    fechaCargo: Date | null;
    total: number;
    divisaId: string;
    cuentaId: string;
    estado: string;
    empresaId: string;
}

export type GetRemesa = (id: string) => Promise<Remesa>;

export type GetRemesas = (criteria: Criteria) => RespuestaLista<Remesa>;
