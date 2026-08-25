import { useCallback, useContext, useEffect, useState } from "react";

import { ContextoError, QError } from "./contexto.ts";
import { Modelo, TipoInput, ValorCampoUI } from "./diseño.ts";
import { getFormProps, MetaModelo } from "./dominio.ts";

const aQError = (error: unknown): QError => {
    const apiError = error as QError;
    const errorJS = error as Error;

    return {
        nombre: apiError?.nombre ?? "Error",
        descripcion: apiError?.descripcion ?? errorJS?.message,
    };
};

export function useModelo<T extends Modelo>(
    meta: MetaModelo<T>,
    modeloInicialProp: T,
    onModeloListo?: (t: T) => Promise<void>
): HookModelo<T> {

    const [modelo, setModelo] = useState(modeloInicialProp);
    const [modeloInicial, setModeloInicial] = useState<T>(modeloInicialProp);
    const [errorGuardado, setErrorGuardado] = useState<QError | null>(null);
    const [guardados, setGuardados] = useState(0);

    const { intentar } = useContext(ContextoError);

    const cambiarModelo = useCallback((nuevoModelo: T) => {
        setErrorGuardado(null);
        setModelo(nuevoModelo);
    }, []);

    const init = useCallback((nuevoModelo?: T) => {
        const modeloAUsar = nuevoModelo || modeloInicialProp;
        setErrorGuardado(null);
        setModelo(modeloAUsar);
        setModeloInicial(modeloAUsar);
    }, [modeloInicialProp]);

    const onModeloListoConError = useCallback(
        async (modelo: T) => {
            if (!onModeloListo) return;

            try {
                await intentar(async () => await onModeloListo(modelo));
                setErrorGuardado(null);
                setGuardados((n) => n + 1);
            } catch (error) {
                setErrorGuardado(aQError(error));
            }
        },
        [intentar, onModeloListo]
    );


    useEffect(() => {
        setErrorGuardado(null);
        setModelo(modeloInicialProp);
        setModeloInicial(modeloInicialProp);
    }, [modeloInicialProp]);

    return {
        modelo,
        modeloInicial: modeloInicial || modeloInicialProp,
        init,
        set: cambiarModelo,
        errorGuardado,
        guardados,
        ...getFormProps(modelo, modeloInicial, meta, cambiarModelo, onModeloListoConError, errorGuardado),
    } as const;
}

export type HookModelo<T extends Modelo> = {
    modelo: T,
    modeloInicial: T,
    uiProps: (campo: string, secundario?: string) => UiProps,
    init: (entidad?: T) => void,
    set: (entidad: T) => void,
    modificado: boolean,
    valido: boolean,
    editable: boolean,
    errorGuardado: QError | null,
    guardados: number,
}

type ParamOpcion = {
    valor: string;
    descripcion?: string
};

export type ValorControl = null | boolean | string | ParamOpcion;

export type UiProps = {
    nombre: string;
    valor: ValorCampoUI;
    tipo: TipoInput;
    textoValidacion: string;
    deshabilitado: boolean;
    erroneo: boolean;
    advertido: boolean;
    opcional: boolean;
    valido: boolean;
    modificado: boolean;
    soloLectura: boolean;
    onChange: (valor: ValorControl) => void;
    evaluarCambio: () => void;
    descripcion?: string;
}
