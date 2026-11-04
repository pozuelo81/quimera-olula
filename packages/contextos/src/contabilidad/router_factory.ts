import { MaestroConDetalleAsiento } from "./asiento/vistas/maestro/MaestroConDetalleAsiento.tsx";
import { PantallaPgc } from "./pgc/Pgc.tsx";
import { MaestroConDetalleRegularizacionIva } from "./regularizacion_iva/maestro/MaestroConDetalleRegularizacionIva.tsx";

export class RouterFactoryContabilidadOlula {
    static router = {
        "contabilidad/asiento": MaestroConDetalleAsiento,
        "contabilidad/pgc": PantallaPgc,
        "contabilidad/regularizacion_iva": MaestroConDetalleRegularizacionIva,
    };
}
