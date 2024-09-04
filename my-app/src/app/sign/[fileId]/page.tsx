'use client'

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaPen } from "react-icons/fa";

interface Params {
    fileId: string;
}

interface FileUpload {
    id: string;
    name: string;
    status: "uploading" | "success" | "failed";
    progress: number;
    fileUrl?: string;
}

export default function SignPage({ params }: { params: Params }) {
    const { fileId } = params;
    const [file, setFile] = useState<FileUpload | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem("files") || "[]") as FileUpload[];
        const selectedFile = storedFiles.find(f => f.id === fileId);

        if (selectedFile) {
            setFile(selectedFile);
        }
    }, [fileId]);

    const handleSign = () => {
        if (canvasRef.current) {
            const signatureDataUrl = canvasRef.current.toDataURL(); // Captura a assinatura como uma imagem
            console.log("Assinatura capturada:", signatureDataUrl);
            // Aqui você pode salvar a assinatura junto ao documento ou enviá-la para o backend
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;  // Verificação para garantir que o canvas não seja null
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.stroke();
            canvas.addEventListener("mousemove", draw);
        }
    };

    const stopDrawing = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;  // Verificação para garantir que o canvas não seja null
        canvas.removeEventListener("mousemove", draw);
    };

    const draw = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;  // Verificação para garantir que o canvas não seja null
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    };

    if (!file) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Assinar Documento</h1>
            <div className="relative bg-white p-4 rounded shadow w-full max-w-4xl">
                <iframe
                    src={file.fileUrl}
                    width="100%"
                    height="600px"
                    title="PDF Viewer"
                    className="border-2 border-gray-300 rounded"
                />
                <canvas
                    ref={canvasRef}
                    width="100%"
                    height="600px"
                    className="absolute top-0 left-0 bg-transparent cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                />
            </div>
            <Button onClick={handleSign} className="mt-4 flex items-center">
                <FaPen className="mr-2" /> Assinar
            </Button>
        </div>
    );
}
