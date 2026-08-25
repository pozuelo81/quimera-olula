import { MaestroConDetalleMandato } from "./mandato/maestro/MaestroConDetalleMandato.tsx";
import { MaestroConDetalleReciboVenta } from "./recibo_venta/maestro/MaestroConDetalleReciboVenta.tsx";
import { MaestroConDetalleRemesa } from "./remesa/maestro/MaestroConDetalleRemesa.tsx";

export class RouterFactoryTesoreriaOlula {
    static router = {
        "tesoreria/remesa": MaestroConDetalleRemesa,
        "tesoreria/mandato": MaestroConDetalleMandato,
        "tesoreria/recibo_venta": MaestroConDetalleReciboVenta,
    };
}
