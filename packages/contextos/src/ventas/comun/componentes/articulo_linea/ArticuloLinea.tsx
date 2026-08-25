import { Articulo } from "#/almacen/comun/componentes/Articulo.tsx";
import { TipoArticuloLinea } from "#/ventas/venta/diseño.ts";
import { QIcono, QInput } from "@olula/componentes/index.js";
import { useEffect, useRef } from "react";
import "./ArticuloLinea.css";

export type CamposArticuloLinea = {
    tipoArticulo: TipoArticuloLinea;
    referencia: string | null;
    descripcionArticulo: string | null;
    descripcion: string;
};

interface ArticuloLineaProps extends CamposArticuloLinea {
    nombre?: string;
    onChange: (cambios: Partial<CamposArticuloLinea>) => void;
    ref?: React.RefObject<HTMLInputElement | null>;
    bloqueado?: boolean;
}

export const ArticuloLinea = ({
    tipoArticulo,
    referencia,
    descripcionArticulo,
    descripcion,
    nombre = "referencia",
    onChange,
    bloqueado = false,
}: ArticuloLineaProps) => {
    const refArticulo = useRef<HTMLInputElement | null>(null);
    const refDescripcionRegistrado = useRef<HTMLInputElement | null>(null);
    const refDescripcionLibre = useRef<HTMLInputElement | null>(null);
    const montado = useRef(false);

    useEffect(() => {
        if (!montado.current) {
            montado.current = true;
            return;
        }
        if (tipoArticulo === "generico") {
            refDescripcionRegistrado.current?.focus();
            refDescripcionRegistrado.current?.select();
        } else if (tipoArticulo === "libre") {
            refDescripcionLibre.current?.focus();
            refDescripcionLibre.current?.select();
        } else if (tipoArticulo === "registrado") {
            refArticulo.current?.focus();
        }
    }, [tipoArticulo]);

    const toggleDescripcion = () => {
        const nuevoTipo = tipoArticulo === "registrado" ? "generico" : "registrado";
        onChange({
            tipoArticulo: nuevoTipo,
            descripcion: descripcionArticulo!
        });
    };

    const abrir = () => {
        onChange({ tipoArticulo: "libre", referencia: null, descripcionArticulo: null, descripcion: "" });
    };

    const cerrar = () => {
        onChange({ tipoArticulo: "registrado", referencia: null, descripcionArticulo: null, descripcion: "" });
    };

    if (tipoArticulo !== "libre") {
        return (
            <>
                <div className="ArticuloLinea-campo">
                    <Articulo
                        valor={referencia ?? ""}
                        descripcion={descripcionArticulo ?? ""}
                        nombre={nombre}
                        onChange={(opcion) =>
                            onChange({
                                referencia: opcion?.valor ?? null,
                                descripcionArticulo: opcion?.descripcion ?? null,
                            })
                        }
                        ref={refArticulo}
                        soloLectura={bloqueado}
                    />
                    {referencia && (
                        <button
                            type="button"
                            onClick={toggleDescripcion}
                            title="Editar descripción"
                            aria-label="Editar descripción"
                            className="ArticuloLinea-boton-candado"
                        >
                            <QIcono nombre="editar_2" tamaño="sm" />
                        </button>
                    )}
                    {!bloqueado &&
                        <button
                            type="button"
                            onClick={abrir}
                            title="Abrir descripción libre"
                            aria-label="Abrir descripción libre"
                            className="ArticuloLinea-boton-candado"
                        >
                            <QIcono nombre="candado_abierto" tamaño="sm" />
                        </button>
                    }
                </div>
                {tipoArticulo === "generico" && (
                    <QInput
                        nombre="descripcion"
                        label="Descripción personalizada"
                        valor={descripcion ?? ""}
                        onChange={(val) => onChange({ descripcion: val })}
                        ref={refDescripcionRegistrado}
                    />
                )}
            </>
        );
    }

    return (
        <div className="ArticuloLinea-campo">
            <QInput
                nombre="descripcion"
                label="Descripción"
                valor={descripcion ?? ""}
                onChange={(val) => onChange({ descripcion: val })}
                ref={refDescripcionLibre}
            />
            {!bloqueado &&
                <button
                    type="button"
                    onClick={cerrar}
                    title="Cerrar descripción libre"
                    aria-label="Cerrar descripción libre"
                    className="ArticuloLinea-boton-candado"
                >
                    <QIcono nombre="candado" tamaño="sm" />
                </button>
            }
        </div>
    );
};
