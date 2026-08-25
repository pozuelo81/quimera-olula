import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import { Remesa } from "../diseño.js";
import { getRemesa } from "../infraestructura.js";
import { ContextoDetalleRemesa, EstadoDetalleRemesa } from "./diseño.js";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleRemesa, ContextoDetalleRemesa>;

const pipeRemesa = ejecutarListaProcesos<EstadoDetalleRemesa, ContextoDetalleRemesa>;

export const metaRemesa: MetaModelo<Remesa> = {
    campos: {
        fecha: { tipo: "fecha" },
        fechaCargo: { tipo: "fecha" },
        estado: { tipo: "texto" },
        cuentaId: { tipo: "texto" },
        divisaId: { tipo: "texto" },
        empresaId: { tipo: "texto" },
        total: { tipo: "moneda" },
    },
    editable: () => false,
};

export const remesaInicial = (): Remesa => ({
    id: '',
    fecha: null,
    fechaCargo: null,
    total: 0,
    divisaId: '',
    cuentaId: '',
    estado: '',
    empresaId: '',
});

export const contextoDetalleRemesaInicial: ContextoDetalleRemesa = {
    estado: 'INICIAL',
    remesa: remesaInicial(),
};

export const cargarRemesa: (_: string) => ProcesarDetalle =
    (idRemesa) => async (contexto) => {
        const remesa = await getRemesa(idRemesa);
        return pipeRemesa(contexto, [
            async (ctx) => ({ ...ctx, remesa }),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idRemesa = payload as string;
    if (idRemesa) {
        return cargarRemesa(idRemesa)(contexto);
    }
    return { ...contexto, estado: 'INICIAL', remesa: remesaInicial() };
};
