import { MetaTabla } from "@olula/componentes/index.js";
import {
    filtroBooleanos,
    filtroTextos,
    MetaFiltro,
} from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { filtroAgente } from "../../comun/filtros.tsx";
import { Cliente } from "../diseño.ts";

export type EstadoMaestroCliente = "INICIAL" | "CREANDO_CLIENTE";

export type ContextoMaestroCliente = {
    estado: EstadoMaestroCliente;
    clientes: ListaActivaEntidades<Cliente>;
};

export const metaTablaCliente: MetaTabla<Cliente> = [
    { id: "id", cabecera: "Id" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "email", cabecera: "Email" },
    { id: "telefono1", cabecera: "Teléfono", tipo: "texto" },
    {
        id: "id_fiscal",
        cabecera: "Id Fiscal",
        render: (entidad: Cliente) =>
            `${entidad.tipo_id_fiscal}: ${entidad.id_fiscal}`,
    },
];

export const metaFiltroCliente: MetaFiltro = {
    nombre: {
        id: "nombre",
        label: "Nombre",
        tipo: "texto",
        filtro: (v) => (v ? filtroTextos("nombre", v) : null),
    },
    id_fiscal: {
        id: "id_fiscal",
        label: "Id Fiscal",
        tipo: "texto",
        filtro: (v) => (v ? filtroTextos("id_fiscal", v) : null),
    },
    email: {
        id: "email",
        label: "Email",
        tipo: "texto",
        filtro: (v) => (v ? filtroTextos("email", v) : null),
    },
    telefono1: {
        id: "telefono1",
        label: "Teléfono",
        tipo: "texto",
        filtro: (v) => (v ? filtroTextos("telefono1", v) : null),
    },
    agente_id: filtroAgente,
    de_baja: {
        id: "de_baja",
        label: "De baja",
        tipo: "checkbox",
        filtro: (v) => (v ? filtroBooleanos("de_baja", v) : null),
    },
};
