'use client';
import React, { useState, useRef } from "react";
import { FaUpload, FaHome } from "react-icons/fa";
import Link from "next/link";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import Web3 from 'web3';
import { PDFDocument } from 'pdf-lib';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pages, setPages] = useState<string[]>([]);
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [signaturePosition, setSignaturePosition] = useState<{ x: number; y: number } | null>(null);
    const sigCanvasRef = useRef<SignatureCanvas | null>(null);
    const signatureRef = useRef<HTMLDivElement | null>(null);
    const [pdfScale, setPdfScale] = useState<number>(1);
    const [signedFile, setSignedFile] = useState<File | null>(null); // Adicione um estado para o arquivo assinado

    async function handleFileUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        setUploadStatus("Enviando...");

        try {
            const response = await api.post("/api/upload", formData);
            if (response.data.fileUrl && response.data.documentId) {
                setPdfUrl(response.data.fileUrl);
                setDocumentId(response.data.documentId);
                setUploadStatus("Upload concluído com sucesso!");
                renderPDF(response.data.fileUrl);

                const arrayBuffer = await file.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const documentHash = Web3.utils.sha3(uint8Array);

                console.log("Hash gerado para o documento:", documentHash);
                await api.post('/api/add-document', { documentHash });
            }
        } catch (error) {
            console.error("Erro ao carregar o documento:", error);
            setUploadStatus("Erro ao carregar o documento.");
        }
    }

    async function handleSignedDocumentUpload() {
        if (!signedFile) return;

        const formData = new FormData();
        formData.append("file", signedFile);
        setUploadStatus("Enviando documento assinado...");

        try {
            const response = await api.post("/api/upload", formData);
            if (response.data.fileUrl && response.data.documentId) {
                setPdfUrl(response.data.fileUrl);
                setDocumentId(response.data.documentId);
                setUploadStatus("Upload do documento assinado concluído!");

                const arrayBuffer = await signedFile.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const signedDocumentHash = Web3.utils.sha3(uint8Array); // Use o conteúdo real do arquivo

                console.log("Hash gerado para o documento assinado:", signedDocumentHash);
                await api.post('/api/add-document', { documentHash: signedDocumentHash });
            }
        } catch (error) {
            console.error("Erro ao carregar o documento assinado:", error);
            setUploadStatus("Erro ao carregar o documento assinado.");
        }
    }

    const renderPDF = async (pdfUrl: string) => {
        try {
            const loadingTask = getDocument(pdfUrl);
            const pdf = await loadingTask.promise;

            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            setPdfScale(viewport.scale);

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            if (!context) throw new Error("Erro no contexto do canvas.");

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: context, viewport: viewport }).promise;

            setPages([canvas.toDataURL("image/png")]);
        } catch (error) {
            console.error("Erro ao renderizar o PDF:", error);
            setUploadStatus("Erro ao renderizar o documento.");
        }
    };

    const captureSignature = async () => {
        if (sigCanvasRef.current) {
            // Captura a imagem da assinatura
            const dataURL = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
            setSignatureImage(dataURL);

            // Gera um novo PDF com a assinatura
            const newPdfFile = await generatePdfWithSignature(file, dataURL);
            if (newPdfFile) {
                const fileName = `${file?.name.split('.').slice(0, -1).join('.')}-signed.pdf`; // Gera um nome para o PDF assinado
                const signedFileObj = new File([newPdfFile], fileName, { type: 'application/pdf' });
                setSignedFile(signedFileObj); // Atualiza o estado do arquivo assinado
            }
        }
    };

    const generatePdfWithSignature = async (originalFile: File | null, signatureImageDataURL: string) => {
        if (!originalFile) return null; // Verifica se o arquivo original está disponível

        const originalPdfBytes = await originalFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(originalPdfBytes);
        const page = pdfDoc.getPage(0);

        const pngImage = await pdfDoc.embedPng(signatureImageDataURL);
        const signatureWidth = 100; // Ajuste o tamanho conforme necessário
        const signatureHeight = (pngImage.height / pngImage.width) * signatureWidth; // Mantém a proporção

        page.drawImage(pngImage, {
            x: 50,
            y: 50,
            width: signatureWidth,
            height: signatureHeight,
        });

        const pdfBytes = await pdfDoc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' }); // Retorna o Blob do PDF assinado
    };

    const clearSignature = () => {
        sigCanvasRef.current?.clear();
        setSignatureImage(null);
        setSignaturePosition(null);
    };

    const handleDrag = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const element = signatureRef.current!; 
        if (!element) return;

        const offsetX = event.clientX - (element.getBoundingClientRect().left || 0);
        const offsetY = event.clientY - (element.getBoundingClientRect().top || 0);

        function onMouseMove(e: MouseEvent) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            setSignaturePosition({ x, y });
        }

        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const saveSignatureToDocument = async () => {
        if (documentId && signatureImage && signaturePosition) {
            const adjustedPosition = {
                x: signaturePosition.x / pdfScale,
                y: signaturePosition.y / pdfScale,
            };

            try {
                const response = await api.post("/api/save-signature", {
                    documentId,
                    pdfUrl,
                    signatureImage,
                    position: adjustedPosition,
                });
                if (response.data.status === "success") {
                    setUploadStatus("Assinatura salva com sucesso no documento!");
                } else {
                    setUploadStatus("Erro ao salvar a assinatura.");
                    console.error("Erro ao salvar a assinatura no backend:", response.data);
                }
            } catch (error) {
                console.error("Erro ao salvar a assinatura:", error);
                setUploadStatus("Erro ao salvar a assinatura.");
            }
        } else {
            console.error("Dados ausentes para salvar assinatura:", { documentId, pdfUrl, signatureImage, signaturePosition });
            setUploadStatus("Erro: dados ausentes para salvar a assinatura.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <nav className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Blockchain Signature</h1>
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
                            <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} accept=".pdf" />
                            <FaUpload className="text-4xl text-gray-500 mx-auto" />
                            <p className="mt-2 text-sm text-gray-600">Selecione o arquivo PDF</p>
                        </label>
                    </div>
                    <Button className="mt-5" type="submit" disabled={!file}>
                        {uploadStatus ? uploadStatus : "Enviar PDF"}
                    </Button>
                </form>

                <div>
                    {pages.map((page, index) => (
                        <img key={index} src={page} alt={`Page ${index + 1}`} className="w-full max-w-md mb-4" />
                    ))}
                </div>

                <div className="w-100 h-36 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center p-2 mt-5 shadow-sm">
                    <SignatureCanvas ref={sigCanvasRef} canvasProps={{ width: 500, height: 150, className: "sigCanvas" }} />
                </div>
                <div className="flex space-x-4 mt-2">
                    <Button onClick={captureSignature}>Capturar Assinatura</Button>
                    <Button onClick={clearSignature} variant="outline">Limpar Assinatura</Button>
                </div>

                {signatureImage && (
                    <div
                        ref={signatureRef}
                        onMouseDown={handleDrag}
                        className="absolute cursor-move z-10 bg-gray-100 p-2 border rounded-lg shadow-md"
                        style={{ left: 100, top: 100 }}
                    >
                        <div className="bg-blue-500 text-white p-1 rounded-t-md">Arraste para mover</div>
                        <img src={signatureImage} alt="Assinatura" style={{ width: "100px" }} />
                        <Button onClick={saveSignatureToDocument} className="mt-2">Salvar no Documento</Button>
                    </div>
                )}

                {/* Botão para enviar documento assinado */}
                <form onSubmit={(e) => { e.preventDefault(); if (signedFile) handleSignedDocumentUpload(); }}>
                    <Button className="mt-5" type="submit" disabled={!signedFile}>
                        Enviar Documento Assinado
                    </Button>
                </form>
            </main>
        </div>
    );
}
