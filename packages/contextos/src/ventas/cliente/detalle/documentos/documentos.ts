/** Documentos del cliente: botones a sus pantallas y reglas para ver la pestaña. */
export const documentos = [
    {
        texto: "Presupuestos",
        url: "/ventas/presupuesto",
        regla: "ventas.presupuesto.leer",
    },
    { texto: "Pedidos", url: "/ventas/pedido", regla: "ventas.pedido.leer" },
    { texto: "Albaranes", url: "/ventas/albaran", regla: "ventas.albaran.leer" },
    { texto: "Facturas", url: "/ventas/factura", regla: "ventas.factura.leer" },
    {
        texto: "Recibos",
        url: "/tesoreria/recibo_venta",
        regla: "tesoreria.recibo_venta",
    },
];
