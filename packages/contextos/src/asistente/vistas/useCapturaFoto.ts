import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export interface FotoCapturada {
    datosBase64: string;
    tipoMime: string;
}

interface UseCapturaFoto {
    /** false si el navegador no soporta getUserMedia (contexto no seguro sin HTTPS,
     * Safari antiguo...) — degradación silenciosa, el botón de cámara no debe mostrarse
     * en ese caso. */
    soportado: boolean;
    /** true mientras la ventanita de vista previa de la cámara está abierta. */
    abierta: boolean;
    error: string | null;
    /** Ref a asignar al <video> que muestra la vista previa en directo. */
    videoRef: RefObject<HTMLVideoElement | null>;
    /** Pide permiso y abre la cámara — no hace nada si ya está soportado=false. */
    abrir: () => Promise<void>;
    /** Cierra la cámara sin capturar nada (libera la pista de vídeo). */
    cerrar: () => void;
    /** Toma la foto del frame actual del <video> — null si la cámara no está lista. */
    capturar: () => FotoCapturada | null;
}

const soportaCaptura = (): boolean =>
    typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

export function useCapturaFoto(): UseCapturaFoto {
    const [abierta, setAbierta] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const soportado = soportaCaptura();

    const liberarCamara = useCallback(() => {
        streamRef.current?.getTracks().forEach(pista => pista.stop());
        streamRef.current = null;
    }, []);

    const cerrar = useCallback(() => {
        liberarCamara();
        setAbierta(false);
    }, [liberarCamara]);

    const abrir = useCallback(async () => {
        if (!soportado) return;
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            streamRef.current = stream;
            setAbierta(true);
        } catch {
            setError("No se pudo acceder a la cámara.");
            liberarCamara();
        }
    }, [soportado, liberarCamara]);

    // El <video> solo se monta cuando abierta=true — se asigna el stream ya capturado
    // en cuanto el elemento exista en el DOM.
    useEffect(() => {
        if (abierta && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [abierta]);

    // Libera la cámara si el componente se desmonta con la ventanita aún abierta.
    useEffect(() => () => liberarCamara(), [liberarCamara]);

    const capturar = useCallback((): FotoCapturada | null => {
        const video = videoRef.current;
        if (!video || video.videoWidth === 0) return null;

        const lienzo = document.createElement("canvas");
        lienzo.width = video.videoWidth;
        lienzo.height = video.videoHeight;
        const contexto = lienzo.getContext("2d");
        if (!contexto) return null;
        contexto.drawImage(video, 0, 0);

        const dataUrl = lienzo.toDataURL("image/jpeg", 0.85);
        cerrar();
        return { datosBase64: dataUrl.slice(dataUrl.indexOf(",") + 1), tipoMime: "image/jpeg" };
    }, [cerrar]);

    return { soportado, abierta, error, videoRef, abrir, cerrar, capturar };
}
