import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Proyecto } from "../diseño.js";
import { getProyecto, getProyectos } from "../infraestructura.js";
import { ContextoMaestroProyecto, EstadoMaestroProyecto } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroProyecto, ContextoMaestroProyecto>;

const conProyectos = (fn: ProcesarListaActivaEntidades<Proyecto>) =>
    (ctx: ContextoMaestroProyecto) => ({ ...ctx, proyectos: fn(ctx.proyectos) });

export const Proyectos = accionesListaActivaEntidades(conProyectos);

export const recargarProyectos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getProyectos(criteria);
    return Proyectos.recargar(contexto, resultado);
};

export const ampliarProyectos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getProyectos(criteria);
    return Proyectos.ampliar(contexto, resultado);
};

export const incluirProyectoCreadoPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const proyecto = await getProyecto(id);
    return {
        ...contexto,
        estado: "INICIAL",
        proyectos: {
            ...contexto.proyectos,
            lista: [proyecto, ...contexto.proyectos.lista],
            total: contexto.proyectos.total + 1,
            activo: proyecto.id,
        },
    };
};
