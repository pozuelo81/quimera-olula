import { RestAPI } from "@olula/lib/api/rest_api.ts";
import ApiUrls from "../comun/urls.js";
import {
    CambiosProyecto,
    DeleteProyecto,
    EstadoProyecto,
    GetProyecto,
    GetProyectos,
    PatchProyecto,
    PostProyecto,
    Proyecto,
} from "./diseño.js";

type EstadoProyectoApi = 'ABIERTO' | 'CERRADO' | 'EN_CURSO' | 'CANCELADO' | 'SUSPENDIDO';

export interface ProyectoApi {
    id: string;
    nombre: string;
    nombre_completo: string;
    estado: EstadoProyectoApi;
    fecha_inicio: string;
    fecha_fin: string | null;
}

export interface NuevoProyectoApi {
    nombre: string;
    cliente_id: string;
}

type CambiosProyectoApi = {
    nombre?: string;
    fecha_fin?: string | null;
};

const baseUrl = new ApiUrls().PROYECTO;

// const estadoDesdeApi = (api: EstadoProyectoApi): EstadoProyecto => {
//     switch (api) {
//         case 'ABIERTO':
//             return 'ABIERTO';

export const proyectoDesdeApi = (api: ProyectoApi): Proyecto => ({
    id: api.id,
    nombre: api.nombre,
    nombreCompleto: api.nombre_completo,
    estado: api.estado as EstadoProyecto,
    fechaInicio: new Date(Date.parse(api.fecha_inicio)),
    fechaFin: api.fecha_fin ? new Date(Date.parse(api.fecha_fin)) : null,
});

const cambiosProyectoAApi = (m: CambiosProyecto): CambiosProyectoApi => {
    const cambios: CambiosProyectoApi = {};
    if (m.nombre !== undefined) cambios['nombre'] = m.nombre;
    if (m.fechaFin !== undefined) cambios['fecha_fin'] = m.fechaFin ? m.fechaFin.toISOString() : null;
    return cambios;
};

export const getProyecto: GetProyecto = async (id) => {
    return await RestAPI.getItem<Proyecto, ProyectoApi>(
        `${baseUrl}/${id}`,
        proyectoDesdeApi,
    );
};

export const getProyectos: GetProyectos = async (criteria) => {
    console.log("getProyectos criteria:", baseUrl);
    return await RestAPI.getQuery<Proyecto, ProyectoApi>(
        baseUrl,
        criteria,
        proyectoDesdeApi,
    );
};

export const postProyecto: PostProyecto = async (nuevoProyecto) => {
    const respuesta = await RestAPI.post<NuevoProyectoApi>(
        baseUrl,
        { nombre: nuevoProyecto.nombre, cliente_id: nuevoProyecto.idCliente },
        "Error al crear proyecto"
    );
    return respuesta.id;
};

export const patchProyecto: PatchProyecto = async (id, cambios) => {
    await RestAPI.patch<CambiosProyectoApi>(
        `${baseUrl}/${id}`,
        cambiosProyectoAApi(cambios),
        "Error al actualizar proyecto"
    );
};

export const deleteProyecto: DeleteProyecto = async (id) => {
    await RestAPI.delete(
        `${baseUrl}/${id}`,
        "Error al eliminar proyecto"
    );
};
