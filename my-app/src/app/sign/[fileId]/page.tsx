"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
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
}

export default function SignPage({ params }: { params: Params }) {
    const { fileId } = params;
    const [file, setFile] = useState<FileUpload | null>(null);

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem('files') || '[]');
        const selectedFile = storedFiles.find((f: FileUpload) => f.id === fileId);
        setFile(selectedFile);
    }, [fileId]);

    const handleSign = () => {
        // Lógica para assinar o documento
        console.log("Documento assinado!");
    };

    if (!file) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Assinar Documento</h1>
            <div className="bg-white p-4 rounded shadow">
                <Document file={file.name}>
                    <Page pageNumber={1} />
                </Document>
                <Button onClick={handleSign} className="mt-4 flex items-center">
                    <FaPen className="mr-2" /> Assinar
                </Button>
            </div>
        </div>
    );
}
