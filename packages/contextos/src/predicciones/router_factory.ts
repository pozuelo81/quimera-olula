import { Ventas } from "./dashboard/vistas/Ventas.tsx";
import { MetricasDashboard } from "./metricas/vistas/MetricasDashboard.tsx";
import { StockDashboard } from "./stock/vistas/StockDashboard.tsx";

export class RouterFactoryPrediccionesOlula {
    static router = {
        "predicciones/dashboard": Ventas,
        "predicciones/stock": StockDashboard,
        "predicciones/metricas": MetricasDashboard,
    }
}
