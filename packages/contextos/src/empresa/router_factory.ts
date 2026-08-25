import { MaestroConDetalleCuentaBancaria } from "./cuentas_bancarias/maestro/MaestroConDetalleCuentaBancaria.tsx";
import { MaestroConDetalleEmpresa } from "./empresa/maestro/MaestroConDetalleEmpresa.tsx";

export class RouterFactoryEmpresaOlula {
    static router = {
        "empresa/empresa": MaestroConDetalleEmpresa,
        "empresa/cuentas_bancarias": MaestroConDetalleCuentaBancaria,
    }
}
