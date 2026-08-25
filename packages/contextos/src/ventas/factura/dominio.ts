import { MetaTabla } from "@olula/componentes/index.js";
import {
    cambioClienteVentaVacio,
    clienteVentaVacio,
    nuevaVentaVacia,
    ventaVacia
} from "../venta/dominio.ts";
import {
    CambioClienteFactura,
    Factura,
    NuevaFactura
} from "./diseño.ts";

// Factura no tiene concepto de estado en el dominio, así que empieza en código.
export const metaTablaFactura: MetaTabla<Factura> = [
    {
        id: "codigo",
        cabecera: "Código",
        prioridad: "alta",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
        prioridad: "alta",
        render: (f) => f.cliente.nombre_cliente,
    },
    {
        id: "fecha",
        cabecera: "Fecha",
        tipo: "fecha",
        prioridad: "alta",
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
        prioridad: "alta",
        divisa: (factura) => factura.divisa_id,
    },
    {
        id: "nombre_agente",
        cabecera: "Agente",
        prioridad: "baja",
    },
    {
        id: "almacen_id",
        cabecera: "Almacén",
        prioridad: "baja",
        render: (f) => f.nombre_almacen || f.almacen_id,
    },
];

export const facturaVacia = (): Factura => ({
    ...ventaVacia,
    cliente: clienteVentaVacio,
    editable: false,
    por_comision: 0,
    estadoExpedicion: "",
});

export const nuevaFacturaVacia: NuevaFactura = nuevaVentaVacia;

export const cambioClienteFacturaVacio: CambioClienteFactura = cambioClienteVentaVacio;

