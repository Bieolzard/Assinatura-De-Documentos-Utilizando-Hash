"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Document {
  id: string;
  filePath: string;
  name: string;
  signatureUrl: string; // Adicione a propriedade signatureUrl
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
  const [showSigned, setShowSigned] = useState(false); // Estado para alternar entre versões

  useEffect(() => {
    async function fetchDocument() {
        if (id) {
            try {
                const response = await api.get(`/api/documents/${id}`);
                setDocument(response.data.data); // Certifique-se de que está acessando a propriedade correta
            } catch (error) {
                console.error("Erro ao buscar documento:", error);
            }
        }
    }
    fetchDocument();
}, [id]);


  const handleToggleVersion = () => {
    setShowSigned((prev) => !prev); // Alterna a versão a ser exibida
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Visualizar Documento</h1>
      {document ? (
        <div className="w-full max-w-md bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-semibold text-center mb-4">{document.name}</h2>

          <button
            onClick={handleToggleVersion}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
            {showSigned ? 'Ver versão original' : 'Ver versão assinada'}
          </button>

          <iframe
            src={showSigned ? document.signatureUrl : document.filePath} // Muda a fonte do iframe
            title={document.name}
            className="w-full h-96 border border-gray-300 rounded"
          >
            Este navegador não suporta PDFs.
          </iframe>

        </div>
      ) : (
        <p>Carregando documento...</p>
      )}
    </div>
  );
}
