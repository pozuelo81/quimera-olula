import { QIcono } from "./qicono.tsx";
import "./qtarjeta_resumen.css";

type QTarjetaResumenProps = {
    titulo: string;
    valor: string;
    icono: string;
    comparacion?: { valor: string; positivo: boolean } | null;
};

export const QTarjetaResumen = ({
    titulo,
    valor,
    icono,
    comparacion,
}: QTarjetaResumenProps) => {
    return (
        <quimera-tarjeta-resumen>
            <div className="cabecera">
                <span className="titulo">{titulo}</span>
                <QIcono nombre={icono} tamaño="sm" color="var(--gris-6)" />
            </div>
            <span className="valor">{valor}</span>
            {comparacion && (
                <span className="comparacion" data-positivo={comparacion.positivo}>
                    <QIcono
                        nombre={comparacion.positivo ? "arriba" : "abajo"}
                        tamaño="xs"
                    />
                    {comparacion.valor}
                </span>
            )}
        </quimera-tarjeta-resumen>
    );
};
