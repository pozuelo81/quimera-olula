import { ProcesarContexto } from "@olula/lib/diseño.js";
import { cargar, listaSeleccionableVacia } from "@olula/lib/entidad.ts";
import { presupuestoVacio } from "../../presupuesto/detalle/detalle.ts";
import { getLineas, getPresupuesto } from "../../presupuesto/infraestructura.ts";
import { LineaPresupuesto } from "../../presupuesto/diseño.ts";
import { LineaAprobarPresupuesto } from "../diseño.ts";
import { ordenLineas, pendienteDeLinea } from "../dominio.ts";
import { patchAprobarPresupuestoParcial } from "../infraestructura.ts";
import { ContextoAprobarPresupuesto, EstadoAprobarPresupuesto } from "./diseño.ts";

export const contextoVacio: ContextoAprobarPresupuesto = {
    estado: "INICIAL",
    presupuesto: presupuestoVacio(),
    lineas: listaSeleccionableVacia<LineaAprobarPresupuesto>(),
};

type ProcesarAprobarPresupuesto = ProcesarContexto<EstadoAprobarPresupuesto, ContextoAprobarPresupuesto>;

/** La línea que llega del servidor más el campo local de esta pantalla. */
const paraAprobar = (lineas: LineaPresupuesto[]): LineaAprobarPresupuesto[] =>
    lineas.map((linea) => ({ ...linea, a_aprobar: 0 }));

export const cargarDatos: ProcesarAprobarPresupuesto = async (contexto, presupuestoId) => {
    const presupuestoIdStr = presupuestoId as string;
    const presupuesto = await getPresupuesto(presupuestoIdStr);
    const lineasData = await getLineas(presupuestoIdStr, ordenLineas);

    return {
        ...contexto,
        presupuesto,
        lineas: cargar(paraAprobar(lineasData))(contexto.lineas),
        estado: "LISTO",
    };
};

export const cambiarCantidadLinea: ProcesarAprobarPresupuesto = async (contexto, payload) => {
    const { id, cantidad } = payload as { id: string; cantidad: number };
    const lineasActualizadas = contexto.lineas.lista.map((l) => {
        if (String(l.id) !== String(id)) return l;
        const maximo = pendienteDeLinea(l);
        return {
            ...l,
            a_aprobar: Math.min(maximo, Math.max(0, Number(cantidad) || 0)),
        };
    });

    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            lista: lineasActualizadas,
        },
    };
};

export const actualizarEstadoCerradoLinea: ProcesarAprobarPresupuesto = async (contexto, payload) => {
    const { id, cerrada } = payload as { id: string; cerrada: boolean };
    const lineasActualizadas = contexto.lineas.lista.map((l) => {
        if (String(l.id) !== String(id)) return l;
        return {
            ...l,
            cerrada,
            a_aprobar: cerrada ? 0 : l.a_aprobar,
        };
    });

    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            lista: lineasActualizadas,
        },
    };
};

export const aprobarTodas: ProcesarAprobarPresupuesto = async (contexto) => {
    const lineasActualizadas = contexto.lineas.lista.map((l) => {
        if (l.cerrada) return l;
        return {
            ...l,
            a_aprobar: pendienteDeLinea(l),
        };
    });

    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            lista: lineasActualizadas,
        },
    };
};

export const aprobarPresupuesto: ProcesarAprobarPresupuesto = async (contexto) => {
    const pedidoCreado = await patchAprobarPresupuestoParcial(contexto.presupuesto.id, contexto.lineas.lista);

    const presupuestoActualizado = await getPresupuesto(contexto.presupuesto.id);
    const lineasActualizadas = await getLineas(contexto.presupuesto.id, ordenLineas);

    return {
        ...contexto,
        presupuesto: presupuestoActualizado,
        lineas: cargar(paraAprobar(lineasActualizadas))(contexto.lineas),
        pedidoCreado,
    };
};

export const puedeAprobar = (datos: {
    presupuesto: ContextoAprobarPresupuesto['presupuesto'];
    lineas: ContextoAprobarPresupuesto['lineas'];
}): boolean => {
    const { presupuesto, lineas } = datos;
    const hayLineasParaAprobar = lineas.lista.some(
        (linea) => linea.a_aprobar > 0
    );

    return hayLineasParaAprobar && presupuesto.estado_aprobado !== "TOTAL";
};

export const hayPendiente = (lineas: ContextoAprobarPresupuesto['lineas']): boolean => {
    return lineas.lista.some((linea) => pendienteDeLinea(linea) > 0);
};
