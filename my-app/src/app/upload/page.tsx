'use client'
import React, { useState, useRef } from "react";
import { FaUpload, FaHome, FaSignInAlt, FaUserPlus, FaFolderOpen } from "react-icons/fa";
import Link from "next/link";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import * as pdfjsLib from "pdfjs-dist/webpack";
import SignatureCanvas from "react-signature-canvas";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pages, setPages] = useState<string[]>([]);
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [signaturePosition, setSignaturePosition] = useState<{ x: number, y: number } | null>(null);
    const sigCanvasRef = useRef<SignatureCanvas | null>(null);

    async function handleFileUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        setUploadStatus(null);

        try {
            const response = await api.post("/api/upload", formData);
            if (response.data.fileUrl && response.data.documentId) {
                setPdfUrl(response.data.fileUrl);
                setDocumentId(response.data.documentId);
                renderPDF(response.data.fileUrl);
                setUploadStatus("Upload concluído com sucesso!");
            } else {
                setUploadStatus("Erro: URL do PDF ou ID do documento não encontrado na resposta.");
            }
        } catch (error) {
            setUploadStatus("Erro ao carregar o documento. Verifique o formato e tente novamente.");
        } finally {
            setIsUploading(false);
        }
    }

    const renderPDF = async (pdfUrl: string) => {
        try {
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            const pagesArr: string[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) throw new Error("Erro no contexto do canvas.");

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport: viewport }).promise;

                pagesArr.push(canvas.toDataURL("image/png"));
            }

            setPages(pagesArr);
        } catch (error) {
            setUploadStatus("Erro ao renderizar o documento.");
        }
    };

    const handleSignaturePosition = (event: React.MouseEvent) => {
        const { offsetX, offsetY } = event.nativeEvent;
        setSignaturePosition({ x: offsetX, y: offsetY });
        console.log(`Posição da assinatura: X=${offsetX}, Y=${offsetY}`);
    };

    const saveSignature = async () => {
        if (sigCanvasRef.current && documentId && pdfUrl && signaturePosition) {
            const signatureImage = sigCanvasRef.current.toDataURL("image/png");

            try {
                const response = await api.post("/api/save-signature", {
                    documentId,
                    pdfUrl,
                    signatureImage,
                    position: signaturePosition,
                });

                if (response.data.status === "success") {
                    setUploadStatus("Assinatura salva com sucesso!");
                } else {
                    setUploadStatus("Erro ao salvar a assinatura.");
                }
            } catch (error) {
                setUploadStatus("Erro ao salvar a assinatura. Tente novamente.");
            }
        } else {
            setUploadStatus("Erro ao salvar a assinatura: dados ausentes ou posição não selecionada.");
        }
    };

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) setFile(e.target.files[0]);
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <nav className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Meu Sistema</h1>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/home" className="flex items-center">
                                <FaHome className="mr-2" /> Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/upload" className="flex items-center">
                                <FaUpload className="mr-2" /> Upload
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <main className="flex flex-col items-center justify-center p-4">
                <form onSubmit={handleFileUpload}>
                    <div className="w-full max-w-md items-center justify-center">
                        <label className="block text-center p-4 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer">
                            <input type="file" onChange={handleFileChange} accept=".pdf" />
                            {file && <p className="mt-2 text-gray-600">Arquivo: {file.name}</p>}
                            <FaUpload className="text-4xl text-gray-500 mx-auto" />
                            <p className="mt-2 text-sm text-gray-600">SELECIONE SEU ARQUIVO</p>
                        </label>
                    </div>
                    <Button className="mt-5" type="submit" disabled={isUploading}>
                        {isUploading ? "Enviando..." : "Enviar"}
                    </Button>
                </form>

                {uploadStatus && <p className="mt-4 text-red-500">{uploadStatus}</p>}

                {pages.length > 0 && (
                    <div className="mt-4 flex flex-col items-center">
                        {pages.map((page, index) => (
                            <div key={index} className="relative mb-4" onClick={handleSignaturePosition}>
                                <img src={page} alt={`Page ${index + 1}`} className="w-full max-w-md" />
                                <SignatureCanvas
                                    ref={sigCanvasRef}
                                    canvasProps={{
                                        width: 500,
                                        height: 800,
                                        className: "signature-canvas absolute top-0 left-0",
                                    }}
                                />
                            </div>
                        ))}
                        <Button onClick={saveSignature} className="mt-4">
                            Salvar Assinatura
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
