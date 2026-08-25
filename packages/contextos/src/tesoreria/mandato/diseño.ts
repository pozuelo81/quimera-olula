import { Criteria, Entidad, RespuestaLista } from "@olula/lib/diseño.ts";

export interface Mandato extends Entidad {
    id: string;
    referencia: string;
    descripcion: string;
    clienteId: string;
    cuentaId: string;
    cuentaClienteId: string;
    tipo: string;
    tipoPago: string;
    numEfectos: number;
    fechaFirma: Date | null;
    lugarFirma: string;
    fechaUltimoAdeudo: Date | null;
    fechaCaducidad: Date | null;
}

export type GetMandato = (id: string) => Promise<Mandato>;

export type GetMandatos = (criteria: Criteria) => RespuestaLista<Mandato>;
