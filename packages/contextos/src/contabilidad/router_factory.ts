import { MaestroConDetalleAsiento } from "./asiento/vistas/maestro/MaestroConDetalleAsiento.tsx";
import { MaestroConDetalleCodigoBalance } from "./codigo_balance/maestro/MaestroConDetalleCodigoBalance.tsx";
import { MaestroConDetalleEjercicio } from "./ejercicio/maestro/MaestroConDetalleEjercicio.tsx";
import { MaestroConDetalleCuentasAnuales } from "./cuentas_anuales/maestro/MaestroConDetalleCuentasAnuales.tsx";
import { MaestroConDetalleLibroDiario } from "./libro_diario/maestro/MaestroConDetalleLibroDiario.tsx";
import { MaestroConDetalleLibroFacturasEmitidas } from "./libro_facturas_emitidas/maestro/MaestroConDetalleLibroFacturasEmitidas.tsx";
import { MaestroConDetalleLibroFacturasRecibidas } from "./libro_facturas_recibidas/maestro/MaestroConDetalleLibroFacturasRecibidas.tsx";
import { MaestroConDetalleLibroMayor } from "./libro_mayor/maestro/MaestroConDetalleLibroMayor.tsx";
import { MaestroConDetallePatrimonioNeto } from "./patrimonio_neto/maestro/MaestroConDetallePatrimonioNeto.tsx";
import { PantallaPgc } from "./pgc/Pgc.tsx";
import { MaestroConDetalleRegularizacionIva } from "./regularizacion_iva/maestro/MaestroConDetalleRegularizacionIva.tsx";
import { MaestroConDetallePlantillaAsiento } from "./plantilla_asiento/maestro/MaestroConDetallePlantillaAsiento.tsx";

export class RouterFactoryContabilidadOlula {
    static router = {
        "contabilidad/asiento": MaestroConDetalleAsiento,
        "contabilidad/pgc": PantallaPgc,
        "contabilidad/codigo_balance": MaestroConDetalleCodigoBalance,
        "contabilidad/plantilla_asiento": MaestroConDetallePlantillaAsiento,
        "contabilidad/ejercicio": MaestroConDetalleEjercicio,
        "contabilidad/cuentas_anuales": MaestroConDetalleCuentasAnuales,
        "contabilidad/libro_diario": MaestroConDetalleLibroDiario,
        "contabilidad/libro_mayor": MaestroConDetalleLibroMayor,
        "contabilidad/libro_facturas_emitidas": MaestroConDetalleLibroFacturasEmitidas,
        "contabilidad/libro_facturas_recibidas": MaestroConDetalleLibroFacturasRecibidas,
        "contabilidad/patrimonio_neto": MaestroConDetallePatrimonioNeto,
        "contabilidad/regularizacion_iva": MaestroConDetalleRegularizacionIva,
    };
}
