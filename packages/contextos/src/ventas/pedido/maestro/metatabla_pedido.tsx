import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";
import { Pedido } from "../diseño.ts";
import { estadoServidoPedido } from "./maestro.ts";

export const getMetaTablaPedido = () => metaTablaPedido;

const metaTablaPedido: MetaTabla<Pedido> = [
  {
    id: "estado",
    cabecera: "",
    render: (pedido: Pedido) => (
      <ColumnaEstadoTabla
        estados={{
          cerrado: (
            <QIcono
              nombre={"circulo_relleno"}
              tamaño="sm"
              color="var(--color-deshabilitado-oscuro)"
            />
          ),
          parcial: (
            <QIcono
              nombre={"circulo_relleno"}
              tamaño="sm"
              color="var(--color-advertencia-oscuro)"
            />
          ),
          pendiente: (
            <QIcono
              nombre={"circulo_relleno"}
              tamaño="sm"
              color="var(--color-exito-oscuro)"
            />
          ),
        }}
        estadoActual={estadoServidoPedido(pedido)}
      />
    ),
  },
  {
    id: "codigo",
    cabecera: "Código",
    prioridad: "alta",
  },
  {
    id: "nombre_cliente",
    cabecera: "Cliente",
    prioridad: "alta",
    render: (p) => p.cliente.nombre_cliente,
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
    divisa: (pedido) => pedido.divisa_id,
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
    render: (p) => p.nombre_almacen || p.almacen_id,
  },
  {
    id: "fecha_salida",
    cabecera: "Fecha salida",
    tipo: "fecha",
    prioridad: "baja",
  },
];
