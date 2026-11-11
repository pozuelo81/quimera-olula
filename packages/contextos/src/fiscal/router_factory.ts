import { EjerciciosFiscales } from "./ejercicio/EjerciciosFiscales.tsx";
import { MaestroImpuestos } from "./impuesto/MaestroImpuestos.tsx";
import { MaestroSeries } from "./serie/MaestroSeries.tsx";

export class RouterFactoryFiscalOlula {
    static router = {
        "fiscal/ejercicio": EjerciciosFiscales,
        "fiscal/serie": MaestroSeries,
        "fiscal/impuesto": MaestroImpuestos,
    };
}
