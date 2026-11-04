import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useFocus } from "@olula/lib/useFocus.ts";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { RegularizacionIva } from "../diseño.ts";
import { opcionesTrimestre } from "../dominio.ts";
import { postRegularizacionIva } from "../infraestructura.ts";
import {
    metaNuevaRegularizacionIva,
    nuevaRegularizacionIvaInicial,
} from "./crear.ts";

export const CrearRegularizacionIva = ({
    publicar,
    regularizaciones,
}: {
    publicar: EmitirEvento;
    regularizaciones: RegularizacionIva[];
}) => {
    const inicial = useMemo(
        () => nuevaRegularizacionIvaInicial(regularizaciones),
        [regularizaciones]
    );

    const { modelo, uiProps, valido } = useModelo(
        metaNuevaRegularizacionIva,
        inicial
    );

    const crear_ = useCallback(async () => {
        const id = await postRegularizacionIva(modelo);
        publicar("regularizacion_iva_creada", id);
    }, [modelo, publicar]);

    const cancelar_ = useCallback(
        () => publicar("alta_de_regularizacion_iva_cancelada"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    const focus = useFocus();

    return (
        <QModal
            abierto={true}
            nombre="crearRegularizacionIva"
            titulo="Nueva regularización de IVA"
            onCerrar={cancelar}
        >
            <div className="CrearRegularizacionIva">
                <quimera-formulario>
                    <QInput label="Ejercicio" {...uiProps("ejercicioId")} ref={focus} />
                    <QSelect
                        label="Periodo"
                        opciones={opcionesTrimestre}
                        {...uiProps("trimestre")}
                    />
                    {modelo.trimestre === "OTRO" && (
                        <>
                            <QDate label="Desde" {...uiProps("fechaInicio")} />
                            <QDate label="Hasta" {...uiProps("fechaFin")} />
                        </>
                    )}
                    <QDate
                        label="Fecha del asiento (por defecto, fin del periodo)"
                        {...uiProps("fechaAsiento")}
                    />
                    <QInput
                        label="Subcuenta H.P. deudora (por defecto, IVADEU)"
                        {...uiProps("codigoSubcuentaDeudora")}
                    />
                    <QInput
                        label="Subcuenta H.P. acreedora (por defecto, IVAACR)"
                        {...uiProps("codigoSubcuentaAcreedora")}
                    />
                </quimera-formulario>

                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Regularizar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
