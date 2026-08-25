import { ArticuloLinea } from "#/ventas/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.js";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext } from "react";
import "./CrearLinea.css";
import {
    metaNuevaLinea,
    nuevaLineaVacia,
    postModelo
} from "./dominio.ts";

export type CrearLineaProps = {
    pedidoId: string;
    publicar: ProcesarEvento;
};

export const CrearLinea = (props: CrearLineaProps) => {
    const { app } = useContext(FactoryCtx);
    const CrearLinea_ = app.Ventas.pedido_CrearLinea as typeof CrearLineaBase;

    return CrearLinea_(props);
};

export const CrearLineaBase = ({ pedidoId, publicar }: CrearLineaProps) => {
    const lineaArticulo = useModelo(metaNuevaLinea, nuevaLineaVacia);

    const linea = lineaArticulo.modelo;

    const crear_ = useCallback(async () => {
        await postModelo(pedidoId, lineaArticulo.modelo);
        publicar("alta_linea_lista");
    }, [lineaArticulo, publicar, pedidoId]);

    const cancelar_ = useCallback(
        () => publicar("crear_linea_cancelado"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    const valido = lineaArticulo.valido;

    return (
        <QModal
            abierto={true}
            nombre="crear_linea_pedido"
            titulo="Crear línea"
            onCerrar={cancelar}
        >
            <div className="CrearLinea">
                <quimera-formulario>
                    <ArticuloLinea
                        tipoArticulo={linea.tipoArticulo}
                        referencia={linea.referencia}
                        descripcionArticulo={linea.descripcionArticulo}
                        descripcion={linea.descripcion ?? ""}
                        nombre="referencia_nueva_linea_pedido"
                        onChange={(cambios) => lineaArticulo.set({ ...linea, ...cambios })}
                    />
                    <QInput label="Cantidad" {...lineaArticulo.uiProps("cantidad")} />
                    {linea.tipoArticulo === "libre" && (
                        <QInput
                            label="PVP unitario"
                            {...lineaArticulo.uiProps("pvp_unitario")}
                        />
                    )}
                </quimera-formulario>
                <div className="botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
