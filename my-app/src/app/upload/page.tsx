"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaRedo, FaCheck, FaTimes, FaUpload, FaHome, FaSignInAlt, FaUserPlus, FaFolderOpen } from "react-icons/fa";
import Link from 'next/link';

interface FileUpload {
    id: string;
    name: string;
    status: "uploading" | "success" | "failed";
    progress: number;
    fileUrl?: string;  // Propriedade opcional para armazenar o URL do arquivo
}

export default function UploadPage() {
    const [files, setFiles] = useState<FileUpload[]>([]);

    // Carregar arquivos do localStorage ao iniciar o componente
    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem('files') || '[]') as FileUpload[];
        setFiles(storedFiles);
    }, []);

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onloadend = () => {
                const base64data = reader.result;
    
                const newFile: FileUpload = {
                    id: `${Date.now()}`,
                    name: file.name,
                    status: 'success',
                    progress: 100,
                    fileUrl: base64data as string, // Salva como Base64
                };
    
                // Recupera arquivos existentes no localStorage
                const storedFiles = JSON.parse(localStorage.getItem('files') || '[]') as FileUpload[];
    
                // Adiciona o novo arquivo
                const updatedFiles = [...storedFiles, newFile];
    
                // Salva novamente no localStorage
                localStorage.setItem('files', JSON.stringify(updatedFiles));
    
                // Atualiza o estado local
                setFiles(updatedFiles);
            };
    
            // Converte o arquivo para Base64
            reader.readAsDataURL(file);
        }
    }

    const handleRetry = (fileId: string) => {
        const updatedFiles = files.map(file =>
            file.id === fileId
                ? { ...file, status: "uploading" as "uploading", progress: 0 }
                : file
        );

        setFiles(updatedFiles);
        localStorage.setItem('files', JSON.stringify(updatedFiles));

        setTimeout(() => {
            const isSuccess = Math.random() > 0.5;

            const finalFiles = updatedFiles.map(file =>
                file.id === fileId
                    ? {
                          ...file,
                          status: isSuccess ? "success" as "success" : "failed" as "failed",
                          progress: 100,
                      }
                    : file
            );

            setFiles(finalFiles);
            localStorage.setItem('files', JSON.stringify(finalFiles));
        }, 2000);
    };

    const handleRemove = (fileId: string) => {
        const updatedFiles = files.filter(file => file.id !== fileId);
        setFiles(updatedFiles);
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
                <div className="w-full max-w-md items-center justify-center">
                    <label className="block text-center p-4 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer">
                        <input type="file" onChange={handleFileUpload} />
                        <FaUpload className="text-4xl text-gray-500 mx-auto" />
                        <p className="mt-2 text-sm text-gray-600">SELECIONE SEU ARQUIVO</p>
                    </label>
                </div>

                <div className="mt-4 w-full max-w-md">
                    {files.map(file => (
                        <div key={file.id} className="flex items-center mb-2 p-2 border rounded">
                            <div className="flex-1">
                                <p className="text-sm truncate">{file.name}</p>
                                <div className="flex items-center mt-1">
                                    {file.status === "uploading" && (
                                        <>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-500 h-2.5 rounded-full"
                                                    style={{ width: `${file.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="ml-2 text-sm text-gray-500">carregando...</span>
                                        </>
                                    )}
                                    {file.status === "success" && (
                                        <span className="ml-2 text-sm text-green-500 flex items-center">
                                            <FaCheck className="mr-1" /> sucesso!
                                        </span>
                                    )}
                                    {file.status === "failed" && (
                                        <span className="ml-2 text-sm text-red-500 flex items-center">
                                            <FaTimes className="mr-1" /> falhou
                                            <FaRedo
                                                className="ml-2 cursor-pointer"
                                                onClick={() => handleRetry(file.id)}
                                            />
                                        </span>
                                    )}
                                </div>
                            </div>
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
