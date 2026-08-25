import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoProyecto } from "../diseño.js";

export const metaNuevoProyecto: MetaModelo<NuevoProyecto> = {
    campos: {
        nombre: { requerido: true, minimo: 1 },
        idCliente: { requerido: true },
    },
};

export const nuevoProyectoInicial: NuevoProyecto = {
    nombre: "",
    idCliente: "",
    nombreCliente: "",
};
