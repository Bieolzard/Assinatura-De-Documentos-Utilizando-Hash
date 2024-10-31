"use client"

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Mantenha esta importação
import SignatureCanvas from "react-signature-canvas";
import { api } from "@/lib/axios";

// Defina a interface para o documento
interface Document {
  id: string;
  filePath: string;
  name: string;
  // Inclua outros campos que você pode precisar
}

interface SignPageProps {
  params: {
    id: string; // O id será acessado através de params
  };
}

export default function SignPage({ params }: SignPageProps) {
  const router = useRouter();
  const { id } = params; // Pega o id diretamente de params
  const [document, setDocument] = useState<Document | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

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

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const handleSave = async () => {
    if (sigCanvas.current) {
      const signatureDataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL();
      try {
        await api.post(`/api/signatures`, {
          documentId: id,
          signature: signatureDataUrl,
        });
        alert("Assinatura salva com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar assinatura:", error);
      }
    }
  };

  const handleClear = () => {
    sigCanvas.current?.clear();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {document ? (
        <>
          <h1 className="text-2xl font-bold">{document.name}</h1>
          <img src={document.filePath} alt={document.name} className="my-4 max-w-full h-auto" />
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              width: 500,
              height: 200,
              className: "border border-gray-300 rounded",
            }}
          />
          <div className="mt-4">
            <button onClick={handleSave} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
              Salvar Assinatura
            </button>
            <button onClick={handleClear} className="bg-red-500 text-white px-4 py-2 rounded">
              Limpar
            </button>
          </div>
        </>
      ) : (
        <p>Carregando documento...</p>
      )}
    </div>
  );
}
