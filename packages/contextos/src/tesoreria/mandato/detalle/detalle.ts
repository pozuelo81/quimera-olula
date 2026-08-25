import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import { Mandato } from "../diseño.js";
import { getMandato } from "../infraestructura.js";
import { ContextoDetalleMandato, EstadoDetalleMandato } from "./diseño.js";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleMandato, ContextoDetalleMandato>;

const pipeMandato = ejecutarListaProcesos<EstadoDetalleMandato, ContextoDetalleMandato>;

export const metaMandato: MetaModelo<Mandato> = {
    campos: {
        referencia: { tipo: "texto" },
        descripcion: { tipo: "texto" },
        clienteId: { tipo: "texto" },
        cuentaId: { tipo: "texto" },
        cuentaClienteId: { tipo: "texto" },
        tipo: { tipo: "texto" },
        tipoPago: { tipo: "texto" },
        numEfectos: { tipo: "entero" },
        fechaFirma: { tipo: "fecha" },
        lugarFirma: { tipo: "texto" },
        fechaUltimoAdeudo: { tipo: "fecha" },
        fechaCaducidad: { tipo: "fecha" },
    },
    editable: () => false,
};

export const mandatoInicial = (): Mandato => ({
    id: '',
    referencia: '',
    descripcion: '',
    clienteId: '',
    cuentaId: '',
    cuentaClienteId: '',
    tipo: '',
    tipoPago: '',
    numEfectos: 0,
    fechaFirma: null,
    lugarFirma: '',
    fechaUltimoAdeudo: null,
    fechaCaducidad: null,
});

export const contextoDetalleMandatoInicial: ContextoDetalleMandato = {
    estado: 'INICIAL',
    mandato: mandatoInicial(),
};

export const cargarMandato: (_: string) => ProcesarDetalle =
    (idMandato) => async (contexto) => {
        const mandato = await getMandato(idMandato);
        return pipeMandato(contexto, [
            async (ctx) => ({ ...ctx, mandato }),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idMandato = payload as string;
    if (idMandato) {
        return cargarMandato(idMandato)(contexto);
    }
    return { ...contexto, estado: 'INICIAL', mandato: mandatoInicial() };
};
