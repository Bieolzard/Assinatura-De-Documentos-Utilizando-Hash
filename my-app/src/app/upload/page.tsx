"use client";

import React, { useState, useEffect } from "react";
import { FaTrash, FaRedo, FaCheck, FaTimes, FaUpload, FaHome, FaSignInAlt, FaUserPlus, FaFolderOpen } from "react-icons/fa";
import Link from 'next/link';
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";


interface FileUpload {
    id: string;
    name: string;
    status: "uploading" | "success" | "failed";
    progress: number;
    fileUrl?: string;  // Propriedade opcional para armazenar o URL do arquivo
}

export default function UploadPage() {
    const [file, setFile] = useState<File>();

    async function handleFileUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData()
        if (!file) {
            return
        }
        formData.append('file', file)

        try {
            const response = await api.post('/api/upload', formData)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return
        }
        setFile(e.target.files[0])
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
                <form onSubmit={handleFileUpload}>
                    <div className="w-full max-w-md items-center justify-center">
                        <label className="block text-center p-4 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer">
                            <input type="file" onChange={handleFileChange} />
                            <FaUpload className="text-4xl text-gray-500 mx-auto" />
                            <p className="mt-2 text-sm text-gray-600">SELECIONE SEU ARQUIVO</p>
                        </label>
                    </div>
                    <Button className="mt-5" type="submit">Enviar</Button>
                </form>

                <div className="mt-4 w-full max-w-md">

                </div>
            </main>
        </div>
    );
}
