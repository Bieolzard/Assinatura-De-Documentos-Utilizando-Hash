"use client";

import { useEffect, useState } from "react";
import { FaEye, FaTrash, FaCheck, FaTimes, FaHome, FaUpload, FaFolderOpen, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FileUpload {
    id: string;
    name: string;
    status: "uploading" | "success" | "failed";
    progress: number;
}

export default function DocumentsPage() {
    const [files, setFiles] = useState<FileUpload[]>([]);
    const router = useRouter();

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem('files') || '[]');
        console.log('Arquivos carregados do localStorage:', storedFiles);
        setFiles(storedFiles);
    }, []);

    const handleOpenDocument = (fileId: string) => {
        router.push(`/sign/${fileId}`);
    };

    const handleRemove = (fileId: string) => {
        // Remove file from state
        const updatedFiles = files.filter(file => file.id !== fileId);
        setFiles(updatedFiles);

        // Remove file from localStorage
        localStorage.setItem('files', JSON.stringify(updatedFiles));
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
                    {files.map((file) => (
                        <div key={file.id} className="flex items-center mb-2 p-2 border rounded">
                            <div className="flex-1">
                                <p className="text-sm truncate">{file.name}</p>
                                <div className="flex items-center mt-1">
                                    {file.status === "uploading" && (
                                        <span className="ml-2 text-sm text-gray-500">carregando...</span>
                                    )}
                                    {file.status === "success" && (
                                        <span className="ml-2 text-sm text-green-500 flex items-center">
                                            <FaCheck className="mr-1" /> sucesso!
                                        </span>
                                    )}
                                    {file.status === "failed" && (
                                        <span className="ml-2 text-sm text-red-500 flex items-center">
                                            <FaTimes className="mr-1" /> tentativa falhou
                                        </span>
                                    )}
                                </div>
                            </div>
                            <FaEye
                                className="ml-4 text-blue-500 cursor-pointer"
                                onClick={() => handleOpenDocument(file.id)}
                            />
                            <FaTrash
                                className="ml-4 text-red-500 cursor-pointer"
                                onClick={() => handleRemove(file.id)}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
