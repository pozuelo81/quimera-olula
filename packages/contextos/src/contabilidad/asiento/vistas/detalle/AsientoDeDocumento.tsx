import { Asiento } from "../../diseño.ts";
import { getAsiento } from "../../infraestructura.ts";
import { CabeceraAsiento } from "./CabeceraAsiento.tsx";
import { PartidasAsientoLista } from "./PartidasAsientoLista.tsx";
import { useEffect, useState } from "react";

/** El asiento de un documento (factura de compra o de venta, regularización
 * de IVA...). Recibe solo el id: el documento no trae el asiento. Sin
 * cabecera muestra solo la tabla de partidas, para documentos que ya enseñan
 * el número y la fecha del asiento en su formulario. */
interface AsientoDeDocumentoProps {
    asientoId: string | null;
    conCabecera?: boolean;
}

export const AsientoDeDocumento = ({
    asientoId,
    conCabecera = true,
}: AsientoDeDocumentoProps) => {
    const [asiento, setAsiento] = useState<Asiento | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!asientoId) {
            setAsiento(null);
            return;
        }
        setCargando(true);
        setError("");
        getAsiento(asientoId)
            .then(setAsiento)
            // El asiento puede haberse borrado desde contabilidad y devolver 404:
            // mejor un mensaje que una promesa rechazada sin gestionar.
            .catch(() => setError("No se ha podido cargar el asiento."))
            .finally(() => setCargando(false));
    }, [asientoId]);

    if (!asientoId) {
        return <p>Esta factura todavía no está contabilizada.</p>;
    }

    if (cargando) return <p>Cargando asiento…</p>;
    if (error) return <p>{error}</p>;
    if (!asiento) return null;

    return (
        <div className="AsientoDeDocumento">
            {conCabecera && <CabeceraAsiento asiento={asiento} />}
            <PartidasAsientoLista partidas={asiento.partidas} />
        </div>
    );
};
