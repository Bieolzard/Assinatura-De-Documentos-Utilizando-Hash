"use client";

import { useEffect, useState } from "react";
import { FaEye, FaTrash, FaCheck, FaTimes, FaHome, FaUpload, FaFolderOpen, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";
import { Document } from "@prisma/client";

export default function DocumentsPage() {
    const [files, setFiles] = useState<Document[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function GetFiles() {
            try {
                const response = await api.get('/api/documents');
                console.log(response);
                setFiles(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        GetFiles();
    }, []);

    const handleOpenDocument = (fileId: string) => {
        router.push(`/sign/${fileId}`);
    };

    const handleRemove = async (fileId: string) => {
        try {
            await api.delete(`/api/documents/${fileId}`);
            setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
        } catch (error) {
            console.error("Erro ao remover o documento:", error);
        }
    };

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
                        <li>
                            <Link href="/documents" className="flex items-center">
                                <FaFolderOpen className="mr-2" /> Documentos
                            </Link>
                        </li>
                        <li>
                            <Link href="/login" className="flex items-center">
                                <FaSignInAlt className="mr-2" /> Login
                            </Link>
                        </li>
                        <li>
                            <Link href="/signup" className="flex items-center">
                                <FaUserPlus className="mr-2" /> Sign Up
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <main className="flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                {files.map((file: Document) => (
    <div key={file.id} className="flex items-center justify-between p-2 border-b">
        <Link href={`sign/${file.id}`} className="text-blue-600 hover:underline">{file.name}</Link>
        <div className="flex space-x-4">
            <button onClick={() => handleOpenDocument(file.id)}>
                <FaEye className="text-green-500" />
            </button>
            <button onClick={() => handleRemove(file.id)}>
                <FaTrash className="text-red-500" />
            </button>
        </div>
        {/* Exibir a imagem se imagePath estiver disponível */}
        {file.imagePath && (
            <img src={file.imagePath} alt={file.name} className="w-20 h-20 object-cover" />
        )}
    </div>
))}
                </div>
            </main>
        </div>
    );
}
