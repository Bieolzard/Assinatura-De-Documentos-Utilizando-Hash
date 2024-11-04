"use client";

import { useEffect, useState } from "react";
import { FaEye, FaTrash, FaHome, FaUpload, FaFolderOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";
import { Document } from "@prisma/client";

export default function DocumentsPage() {
  const [files, setFiles] = useState<Document[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getFiles() {
      try {
        const response = await api.get("/api/documents");
        setFiles(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      }
    }
    getFiles();
  }, []);

  const handleRemove = async (fileId: string) => {
    try {
      await api.delete(`/api/documents/${fileId}`);
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Erro ao remover o documento:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Documentos</h1>
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
          </ul>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Seus Documentos</h2>
          {files.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum documento encontrado.</p>
          ) : (
            files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 border-b">
                <Link href={`/sign/${file.id}`} className="text-blue-600 hover:underline flex-1">
                  {file.name}
                </Link>
                <div className="flex space-x-4">
                  <Link href={`/sign/${file.id}`}>
                    <FaEye className="text-green-500" />
                  </Link>
                  <button onClick={() => handleRemove(file.id)}>
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
                {file.imagePath && (
                  <img
                    src={file.imagePath}
                    alt={file.name}
                    className="w-16 h-16 object-cover ml-2 border border-gray-300 rounded"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
