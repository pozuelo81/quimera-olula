import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { CrearPedido } from "#/ventas/pedido/crear/CrearPedido.tsx";
import { DetallePedido } from "#/ventas/pedido/detalle/DetallePedido.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { QIcono } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { filtroFechas, MetaFiltro } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import { criteriaDefecto, formatearFechaDate } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect } from "react";
import { Cliente } from "../../comun/componentes/Cliente.tsx";
import { PedidoNrj } from "../diseño.ts";
import "./MaestroConDetallePedido.css";
import { getMaquina } from "./maquina.ts";
import { getMetaTablaPedidoNrj } from "./metatabla_pedido.tsx";

const FILTRO_TERMINADOS: ClausulaFiltro = [
  "estado_envio_palets",
  "!",
  "completo",
];

const metaTablaPedidoNrj = getMetaTablaPedidoNrj();

const criteriaInicialNrj = {
  ...criteriaDefecto,
  filtro: [FILTRO_TERMINADOS],
};

const metaFiltroPedidoNrj: MetaFiltro = {
  fecha: {
    id: "fecha",
    label: "Fecha",
    tipo: "intervalo_fechas",
    filtro: (v) => filtroFechas("fecha", v),
  },
  cliente_id: {
    id: "cliente_id",
    label: "Cliente",
    filtro: (v) => (v ? ["cliente_id", "=", v as string] : null),
    render: (valor, onChange) => (
      <Cliente
        label="Cliente"
        nombre="cliente_id"
        valor={(valor as string) ?? ""}
        onChange={(opcion) => onChange(opcion?.valor ?? "")}
      />
    ),
  },
  mostrar_terminados: {
    id: "mostrar_terminados",
    label: "Mostrar terminados",
    tipo: "checkbox",
    valorDefecto: "false",
    filtro: (v) => (v === "true" ? null : FILTRO_TERMINADOS),
    fromFiltro: (filtro) =>
      filtro.some((f) => f[0] === "estado_envio_palets" && f[2] === "completo")
        ? "false"
        : "true",
  },
};

export const MaestroConDetallePedidoNrj = () => {
  const { id, criteria } = getUrlParams();
  const criteriaBase =
    criteria.filtro.length > 0 ? criteria : criteriaInicialNrj;

  const esMovil = useEsMovil();

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    pedidos: listaActivaEntidadesInicial<PedidoNrj>(id, criteriaBase),
    seleccionados: [],
    albaranesCreados: [],
    fallidos: [],
  });

  useUrlParams(ctx.pedidos.activo, ctx.pedidos.criteria);

  useEffect(() => {
    emitir("recarga_de_pedidos_solicitada", criteriaInicialNrj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Pedido">
      <MaestroDetalle<PedidoNrj>
        Maestro={
          <>
            <h2>Pedidos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear_pedido_solicitado")}>
                Nuevo Pedido
              </QBoton>
            </div>
            <Listado<PedidoNrj>
              metaTabla={metaTablaPedidoNrj}
              metaFiltro={metaFiltroPedidoNrj}
              criteriaInicial={criteriaInicialNrj}
              criteria={ctx.pedidos.criteria}
              modo={esMovil ? "tarjetas" : "tabla"}
              tarjeta={TarjetaPedidoNrj}
              entidades={ctx.pedidos.lista as PedidoNrj[]}
              totalEntidades={ctx.pedidos.total}
              seleccionada={ctx.pedidos.activo}
              onSeleccion={(payload) => emitir("pedido_seleccionado", payload)}
              onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
              onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
            />
          </>
        }
        Detalle={<DetallePedido id={ctx.pedidos.activo} publicar={emitir} />}
        layout={esMovil ? "TARJETA" : "TABLA"}
        seleccionada={ctx.pedidos.activo}
      />

      <QModal
        nombre="altaPedido"
        abierto={ctx.estado === "CREANDO_PEDIDO"}
        titulo="Nuevo Pedido"
        onCerrar={() => emitir("creacion_pedido_cancelada")}
      >
        {ctx.estado === "CREANDO_PEDIDO" && <CrearPedido publicar={emitir} />}
      </QModal>
    </div>
  );
};

const estadoCompleto = (
  <QIcono
    nombre={"circulo_relleno"}
    tamaño="sm"
    color="var(--color-exito-oscuro)"
  />
);

const estadoPendiente = (
  <QIcono
    nombre={"circulo_relleno"}
    tamaño="sm"
    color="var(--color-error-oscuro)"
  />
);

const estadoParcial = (
  <QIcono
    nombre={"circulo_relleno"}
    tamaño="sm"
    color="var(--color-advertencia-claro)"
  />
);

const TarjetaPedidoNrj = (pedido: PedidoNrj) => {
  return (
    <div className="tarjeta-pedido" key={pedido.id}>
      <div className="tarjeta-pedido-contenido">
        <div className="tarjeta-pedido-fila">
          <span>{pedido.codigo}</span>
          <div className="tarjeta-pedido-derecha">
            <span>{formatearFechaDate(pedido.fecha)}</span>
            <ColumnaEstadoTabla
              estados={{
                completo: estadoCompleto,
                pendiente: estadoPendiente,
                parcial: estadoParcial,
              }}
              estadoActual={pedido.estado_envio_palets}
            />
          </div>
        </div>
        <div>{`${pedido.cliente_id} - ${pedido.nombre_cliente}`}</div>
        <div>
          {pedido.agente_id
            ? `${pedido.agente_id} - ${pedido.nombre_agente}`
            : "Sin agente"}
        </div>
      </div>
    </div>
  );
};
