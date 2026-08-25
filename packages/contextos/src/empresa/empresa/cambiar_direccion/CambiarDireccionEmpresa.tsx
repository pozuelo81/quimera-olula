import { PaisSelector } from "#/comun/componentes/pais/pais.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { MetaModelo } from "@olula/lib/dominio.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useCallback, useRef } from "react";
import { Empresa } from "../diseño.js";
import { patchEmpresa } from "../infraestructura.js";
import "./CambiarDireccionEmpresa.css";

const metaDireccionEmpresa: MetaModelo<Empresa> = {
    campos: {
        tipoVia: { requerido: false },
        nombreVia: { requerido: false },
        numero: { requerido: false },
        otros: { requerido: false },
        codPostal: { requerido: false },
        ciudad: { requerido: false },
        provincia: { requerido: false },
        paisId: { requerido: false },
        apartado: { requerido: false },
        telefonoDireccion: { requerido: false, tipo: "telefono" },
    },
};

export const CambiarDireccionEmpresa = ({
    empresa,
    publicar,
    onCerrar,
}: {
    empresa: Empresa;
    publicar: EmitirEvento;
    onCerrar: () => void;
}) => {
    // Snapshot al abrir: el autoguardado del tab refresca la entidad y no debe
    // reiniciar el formulario mientras se edita.
    const empresaAlAbrir = useRef(empresa);

    const { modelo, uiProps, valido } = useModelo(
        metaDireccionEmpresa,
        empresaAlAbrir.current,
    );

    const guardar_ = useCallback(
        async () => {
            await patchEmpresa(empresa.id, modelo);
            publicar("direccion_cambiada");
            onCerrar();
        },
        [empresa.id, modelo, publicar, onCerrar],
    );

    const [guardar, cancelar] = useForm(guardar_, onCerrar);

    return (
        <QModal
            abierto={true}
            nombre="cambiarDireccionEmpresa"
            titulo="Dirección"
            onCerrar={cancelar}
        >
            <div className="CambiarDireccionEmpresa">
                <quimera-formulario>
                    <QInput label="Tipo de vía" {...uiProps("tipoVia")} />
                    <QInput label="Nombre de vía" {...uiProps("nombreVia")} />
                    <QInput label="Número" {...uiProps("numero")} />
                    <QInput label="Otros" {...uiProps("otros")} />
                    <QInput label="Cód. postal" {...uiProps("codPostal")} />
                    <QInput label="Ciudad" {...uiProps("ciudad")} />
                    <QInput label="Provincia" {...uiProps("provincia")} />
                    <PaisSelector label="País" {...uiProps("paisId")} />
                    <QInput label="Apartado" {...uiProps("apartado")} />
                    <QInput label="Teléfono" {...uiProps("telefonoDireccion")} />
                </quimera-formulario>

                <div className="botones maestro-botones">
                    <QBoton onClick={guardar} deshabilitado={!valido}>
                        Guardar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
