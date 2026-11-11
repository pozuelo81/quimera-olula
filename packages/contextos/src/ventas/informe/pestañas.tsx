import { CampoInforme, PestañaInforme } from "#/comun/informe_documentos/diseño.ts";
import { OPCIONES_INTERVALO } from "#/comun/informe_documentos/dominio.ts";
import { ControlAgente, ControlCliente } from "./controles.tsx";

/**
 * Pestañas de Ventas > Informes: los criterios de `i_presupuestoscli`,
 * `i_pedidoscli`, `i_albaranescli` e `i_facturascli` de Eneboo, en filas como
 * en sus formularios. Los nombres son los de la API.
 */

const opciones = (valores: string[]) => valores.map((valor) => ({ valor, descripcion: valor }));

const ORDENES = opciones(["No ordenar", "Código", "Cod.Cliente", "Cliente", "Fecha", "Total"]);
const SENTIDOS = opciones(["Ascendente", "Descendente"]);
const TODOS_SI_NO = opciones(["Todos", "Sí", "No"]);

const texto = (id: string, label: string): CampoInforme => ({ id, label, tipo: "texto" });

const combo = (id: string, label: string, valores: CampoInforme["opciones"]): CampoInforme => ({
    id,
    label,
    tipo: "opciones",
    opciones: valores,
});

const filasComunes = (documento: string): CampoInforme[][] => [
    [texto("codigo_desde", `Desde ${documento} Nº`), texto("codigo_hasta", `Hasta ${documento} Nº`)],
    [
        texto("ejercicio_id", "Ejercicio"),
        combo("intervalo", "Intervalo", OPCIONES_INTERVALO),
        { id: "fecha_desde", label: "Fecha desde", tipo: "fecha" },
        { id: "fecha_hasta", label: "Fecha hasta", tipo: "fecha" },
    ],
    [
        { id: "cliente_id", label: "Cliente", tipo: "propio", Control: ControlCliente },
        { id: "agente_id", label: "Agente", tipo: "propio", Control: ControlAgente },
    ],
];

const filasOrden = (documentos: string): CampoInforme[][] => [
    [combo("orden1", `${documentos} por (1)`, ORDENES), combo("tipo_orden1", "Orden", SENTIDOS)],
    [combo("orden2", `${documentos} por (2)`, ORDENES), combo("tipo_orden2", "Orden", SENTIDOS)],
];

const INICIAL_COMUN = {
    intervalo: "",
    orden1: "No ordenar",
    tipo_orden1: "Ascendente",
    orden2: "No ordenar",
    tipo_orden2: "Ascendente",
};

export const PRESUPUESTOS: PestañaInforme = {
    clave: "presupuestos",
    titulo: "Presupuestos",
    url: "/ventas/informe/presupuestos",
    regla: "ventas.presupuesto.leer",
    filas: [
        ...filasComunes("presupuesto"),
        [combo("pte_aprobar", "Pte. aprobar", TODOS_SI_NO)],
        ...filasOrden("Presupuestos"),
    ],
    inicial: { ...INICIAL_COMUN, pte_aprobar: "Todos" },
};

export const PESTAÑAS_VENTAS: PestañaInforme[] = [PRESUPUESTOS];
