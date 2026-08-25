import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { criteriaDefecto, formatearMoneda } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useMemo } from "react";
import { DetalleReciboVenta } from "../detalle/DetalleReciboVenta.js";
import { ReciboVenta } from "../diseño.js";
import "./MaestroConDetalleReciboVenta.css";
import { getMaquina } from "./maquina.js";

const metaTablaReciboVenta: MetaTabla<ReciboVenta> = [
    { id: 'codigo', cabecera: 'Código' },
    { id: 'clienteId', cabecera: 'Cliente' },
    { id: 'idFiscal', cabecera: 'ID Fiscal' },
    { id: 'fechaEmision', cabecera: 'F. Emisión', tipo: 'fecha' },
    { id: 'fechaVencimiento', cabecera: 'F. Vencimiento', tipo: 'fecha' },
    { id: 'estado', cabecera: 'Estado' },
    { id: 'importe', cabecera: 'Importe', tipo: 'moneda' },
];

export const MaestroConDetalleReciboVenta = () => {

    const criteriaBase = useMemo(() => criteriaDefecto, []);

    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        recibos: listaActivaEntidadesInicial<ReciboVenta>(id, criteriaInicial),
    });

    const { recibos } = ctx;

    useUrlParams(recibos.activo, recibos.criteria);

    useEffect(() => {
        emitir("recarga_de_recibos_solicitada", recibos.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="ReciboVenta">
            <MaestroDetalle<ReciboVenta>
                Maestro={
                    <>
                        <h2>Recibos de venta</h2>
                        <Listado<ReciboVenta>
                            metaTabla={metaTablaReciboVenta}
                            criteria={recibos.criteria}
                            modoInicial="tabla"
                            tarjeta={TarjetaReciboVenta}
                            entidades={recibos.lista}
                            totalEntidades={recibos.total}
                            seleccionada={recibos.activo}
                            onSeleccion={(payload) => emitir("recibo_seleccionado", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={<DetalleReciboVenta id={recibos.activo} publicar={emitir} />}
                seleccionada={recibos.activo}
                modoDisposicion="maestro-50"
            />
        </div>
    );
};

const TarjetaReciboVenta = (recibo: ReciboVenta) => {
    return (
        <div className="tarjeta-recibo-venta" key={recibo.id}>
            <div className="tarjeta-recibo-venta-codigo">{recibo.codigo}</div>
            <div className="tarjeta-recibo-venta-importe">
                {formatearMoneda(recibo.importe, "EUR")}
            </div>
            <div className={`tarjeta-recibo-venta-estado estado-${recibo.estado}`}>
                {recibo.estado}
            </div>
        </div>
    );
};
