"use client";

import { useState } from "react";
import { FaTrash, FaRedo, FaCheck, FaTimes, FaUpload, FaHome, FaSignInAlt, FaUserPlus, FaFolderOpen } from "react-icons/fa";
import Link from 'next/link';

interface FileUpload {
    id: string;
    name: string;
    status: "uploading" | "success" | "failed";
    progress: number;
}

export default function UploadPage() {
    const [files, setFiles] = useState<FileUpload[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = event.target.files?.[0];
        
        if (newFile) {
            const newFileObject: FileUpload = {
                id: Math.random().toString(36).substr(2, 9),
                name: newFile.name,
                status: "uploading",
                progress: 0,
            };

            setFiles(prevFiles => {
                const updatedFiles = [...prevFiles, newFileObject];
                // Atualizar o localStorage
                localStorage.setItem('files', JSON.stringify(updatedFiles));
                console.log('Arquivos após upload:', updatedFiles);
                return updatedFiles;
            });

            // Simulação do upload
            setTimeout(() => {
                const isSuccess = Math.random() > 0.5;

                setFiles(prevFiles =>
                    prevFiles.map(file =>
                        file.id === newFileObject.id
                            ? {
                                  ...file,
                                  status: isSuccess ? "success" : "failed",
                                  progress: 100,
                              }
                            : file
                    )
                );

                // Atualizar o localStorage
                const updatedFiles = files.map(file =>
                    file.id === newFileObject.id
                        ? {
                              ...file,
                              status: isSuccess ? "success" : "failed",
                              progress: 100,
                          }
                        : file
                );
                localStorage.setItem('files', JSON.stringify(updatedFiles));
                console.log('Arquivos após simulação de upload:', updatedFiles);
            }, 2000);
        }
    };

    const handleRetry = (fileId: string) => {
        setFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === fileId
                    ? { ...file, status: "uploading", progress: 0 }
                    : file
            )
        );

        setTimeout(() => {
            const isSuccess = Math.random() > 0.5;

            setFiles(prevFiles =>
                prevFiles.map(file =>
                    file.id === fileId
                        ? {
                              ...file,
                              status: isSuccess ? "success" : "failed",
                              progress: 100,
                          }
                        : file
                )
            );

            // Atualizar o localStorage
            const updatedFiles = files.map(file =>
                file.id === fileId
                    ? { ...file, status: isSuccess ? "success" : "failed", progress: 100 }
                    : file
            );
            localStorage.setItem('files', JSON.stringify(updatedFiles));
        }, 2000);
    };

    const handleRemove = (fileId: string) => {
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.filter(file => file.id !== fileId);
            // Atualizar o localStorage
            localStorage.setItem('files', JSON.stringify(updatedFiles));
            return updatedFiles;
        });
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
                        <input type="file" onChange={handleFileUpload} className="hidden" />
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
                                            <FaTimes className="mr-1" /> tentar novamente
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
