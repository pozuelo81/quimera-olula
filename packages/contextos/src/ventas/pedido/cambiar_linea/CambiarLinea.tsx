import { ArticuloLinea } from "#/ventas/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { GrupoIvaProducto } from "@olula/ctx/ventas/comun/componentes/grupo_iva_producto.tsx";
import { FactoryCtx } from "@olula/lib/factory_ctx.js";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo, useState } from "react";
import { LineaPedido } from "../diseño.ts";
import { patchLinea } from "../infraestructura.ts";
import "./CambiarLinea.css";
import { getModeloInicial, metaLinea, ModeloCambiarLinea } from "./dominio.ts";

export type CambiarLineaProps = {
  pedidoId: string;
  linea: LineaPedido;
  publicar: ProcesarEvento;
};

export const CambiarLinea = (props: CambiarLineaProps) => {
  const { app } = useContext(FactoryCtx);
  const CambiarLinea_ = app.Ventas.pedido_CambiarLinea as typeof CambiarLineaBase;

  return CambiarLinea_(props);
};

export const CambiarLineaBase = ({
  pedidoId,
  publicar,
  linea,
}: CambiarLineaProps) => {
  
    const modeloInicial = useMemo(() => getModeloInicial(linea), [linea.id]);

    const { modelo, uiProps, valido, set } = useModelo<ModeloCambiarLinea>(metaLinea, modeloInicial);
    const [mostrarMas, setMostrarMas] = useState(false);

    const cambiar_ = useCallback(async () => {
        await patchLinea(pedidoId, modelo);
        publicar("linea_actualizada");
    }, [modelo, publicar, pedidoId]);

    const cancelar_ = useCallback(
        () => publicar("editar_linea_cancelado"),
        [publicar]
    );

    const [cambiar, cancelar] = useForm(cambiar_, cancelar_);

    const libre = modelo.tipoArticulo === "libre";

    return (
        <QModal
            abierto={true}
            nombre="editar_linea_pedido"
            titulo="Editar línea"
            onCerrar={cancelar}
        >
        <div className="EditarLinea">
            <quimera-formulario>
            <ArticuloLinea
                tipoArticulo={modelo.tipoArticulo}
                referencia={modelo.referencia}
                descripcionArticulo={modelo.descripcionArticulo}
                descripcion={modelo.descripcion}
                nombre="referencia_cambiar_linea_pedido"
                onChange={(cambios) => set({ ...modelo, ...cambios })}
                bloqueado={true}
            />

            <QInput label="Cantidad" {...uiProps("cantidad")} />

            <QInput label="Precio" {...uiProps("pvp_unitario")} />

            <div className="mostrar-mas-fila">
                <button
                type="button"
                className="mostrar-mas-btn"
                onClick={() => setMostrarMas((v) => !v)}
                >
                {mostrarMas ? "▲ Menos opciones" : "▼ Más opciones"}
                </button>
            </div>

            {mostrarMas && (
                <>
                    <QInput label="% Descuento" {...uiProps("dto_porcentual")} />
                    <QInput label="Dto. lineal" {...uiProps("dto_lineal")} />
                    <GrupoIvaProducto {...uiProps("grupo_iva_producto_id")} soloLectura={!libre} />
                    <QInput label="% IVA" {...uiProps("tipo_iva")} soloLectura />
                    <QInput label="% I.R.P.F." {...uiProps("tipo_irpf")} />
                    <QInput label="% Comisión agente" {...uiProps("por_comision")} />
                    <QInput
                        label="Importe comisión"
                        {...uiProps("importe_comision")}
                    />
                </>
            )}
            </quimera-formulario>

            <div className="botones maestro-botones ">
            <QBoton onClick={cambiar} deshabilitado={!valido}>
                Guardar
            </QBoton>
            </div>
        </div>
        </QModal>
    );
};
