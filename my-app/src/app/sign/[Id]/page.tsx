"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Document {
  id: string;
  filePath: string;
  name: string;
}

interface SignPageProps {
  params: {
    id: string;
  };
}

export default function SignPage({ params }: SignPageProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    async function fetchDocument() {
      if (id) {
        try {
          const response = await api.get(`/api/documents/${id}`);
          setDocument(response.data);
        } catch (error) {
          console.error("Erro ao buscar documento:", error);
        }
      }
    }
    fetchDocument();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Visualizar Documento</h1>
      {document ? (
        <div className="w-full max-w-md bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-semibold text-center mb-4">{document.name}</h2>
          <img
            src={document.filePath}
            alt={document.name}
            className="w-full h-auto object-cover border border-gray-300 rounded"
          />
        </div>
      ) : (
        <p>Carregando documento...</p>
      )}
    </div>
  );
}
