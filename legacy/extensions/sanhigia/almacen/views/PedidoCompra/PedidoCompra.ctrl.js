import { util } from "quimera";
import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./PedidoCompra.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
  ordenLineas: {
    field: "codubicacion",
    direction: "ASC",
  },
  logic: {
    ...parent.logic,
    pedidoEditable: pedido => pedido.estadoPda !== "Enviado",
  },
});

export const bunch = parent => {
  const parentConShortCuts = {
    ...parent,
    ...shortcutsBunch(data.shortcuts),
    onCantidadChanged: [],
    onQuitarTrabajadorClicked: [
      {
        type: "userConfirm",
        question: () => ({
          titulo: "Quitar trabajador",
          cuerpo: "Seguro que desea quitar el trabajador asignado a este pedido.",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onQuitarTrabajadorConfirmado",
        onCancel: "focusCodBarras",
      },
    ],
    onCerrarLineasNoInformadasClicked: [
      {
        type: "userConfirm",
        question: () => ({
          titulo: "Cerrar líneas",
          cuerpo: "¿Seguro que desea cerrar todas las líneas sin cantidad a recibir informada?",
          textoSi: "CONFIRMAR",
          textoNo: "CANCELAR",
        }),
        onConfirm: "onCerrarLineasNoInformadasConfirmado",
        onCancel: "focusCodBarras",
      },
    ],
    onCerrarLineasNoInformadasConfirmado: [
      {
        type: "function",
        function: (_, { lineas }) => {
          const data = lineas.idList.map(id => lineas.dict[id]);
          const lineasACerrar = data.filter(l =>
            !l.cerradaPDA &&
            (l.shCantAlbaran === 0 || l.shCantAlbaran == null) &&
            parseFloat(l.totalEnAlbaran) < parseFloat(l.cantidad)
          );
          lineasACerrar.forEach(l =>
            _.dispatch({
              type: "onCerrarLineaClicked",
              payload: { idLineaCerrar: l.idLinea },
            })
          );
        },
      },
    ],
    compruebaCambiaEstadoPda: [
      {
        condition: ({ response }, { pedido }) =>
          !!response?.estadoPda && pedido.buffer?.estadoPda !== response?.estadoPda,
        type: "grape",
        name: "onEstadoPdaActualizado",
      },
    ],
    onQuitarTrabajadorConfirmado: [
      {
        type: "grape",
        name: "onTrabajadorActualizado",
        plug: payload => ({ codTrabajador: null, nombreTrabajador: null, ...payload }),
      },
    ],
    focusCodBarras: [
      {
        condition: () => !!document.getElementById("codBarras"),
        type: "function",
        function: () => document.getElementById("codBarras").select(),
      },
    ],
    irAMovilotes: [
      {
        type: "navigate",
        url: ({ idLinea, idPedido }) => `/pedidosdecompra/${idPedido}/movilotes/${idLinea}`,
      },
    ],
    compruebaAniadirTrabajador: [
      {
        condition: (_, { pedido }) =>
          pedido.buffer.codtrabajador !== util.getUser().codtrabajador,
        type: "grape",
        name: "onTrabajadorActualizado",
        plug: payload => ({
          codTrabajador: util.getUser().codtrabajador,
          nombreTrabajador: util.getUser().nombretrabajador,
          ...payload,
        }),
      },
    ],
  };

  return {
    ...parentConShortCuts,
    ...applyBunch(data.bunch, parentConShortCuts),
  };
};
