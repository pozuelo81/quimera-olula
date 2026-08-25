import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import { Proyecto } from "../diseño.js";
import { getProyecto, patchProyecto } from "../infraestructura.js";
import { ContextoDetalleProyecto, EstadoDetalleProyecto } from "./diseño.js";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleProyecto, ContextoDetalleProyecto>;

const pipeProyecto = ejecutarListaProcesos<EstadoDetalleProyecto, ContextoDetalleProyecto>;

export const metaProyecto: MetaModelo<Proyecto> = {
    campos: {
        nombre: { requerido: true, minimo: 3 },
        estado: { requerido: true },
        fechaInicio: { requerido: true, tipo: 'fecha' },
        fechaFin: { requerido: false, tipo: 'fecha' },
    },
    editable: (proyecto: Proyecto) => proyecto.estado !== 'CERRADO',
};

export const proyectoInicial = (): Proyecto => ({
    id: '',
    nombre: '',
    nombreCompleto: '',
    estado: 'ABIERTO',
    fechaInicio: new Date(),
    fechaFin: null,
});

export const contextoDetalleProyectoInicial: ContextoDetalleProyecto = {
    estado: 'INICIAL',
    proyecto: proyectoInicial(),
};

export const refrescarProyecto: ProcesarDetalle = async (contexto) => {
    const proyecto = await getProyecto(contexto.proyecto.id);
    return [
        { ...contexto, proyecto },
        [["proyecto_cambiado", proyecto]],
    ];
};

export const guardarProyecto = async (
    contexto: ContextoDetalleProyecto,
    proyecto: Proyecto
): Promise<void> => {
    if (proyecto.nombre !== contexto.proyecto.nombre ||
        proyecto.fechaFin !== contexto.proyecto.fechaFin) {
        await patchProyecto(proyecto.id, proyecto);
    }
};

export const cargarProyecto: (_: string) => ProcesarDetalle =
    (idProyecto) => async (contexto) => {
        const proyecto = await getProyecto(idProyecto);
        return pipeProyecto(contexto, [
            async (ctx) => ({ ...ctx, proyecto }),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idProyecto = payload as string;
    if (idProyecto) {
        return cargarProyecto(idProyecto)(contexto);
    }
    return { ...contexto, estado: 'INICIAL', proyecto: proyectoInicial() };
};
