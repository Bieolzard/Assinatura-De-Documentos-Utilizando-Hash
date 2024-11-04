"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUpload, FaFolderOpen, FaPen, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  // Função para lidar com o logout
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
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
              <Button onClick={handleLogout} className="flex items-center">
                <FaSignOutAlt className="mr-2" /> Sair
              </Button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex flex-col items-center p-4">
        {/* Cabeçalho de Boas-vindas */}
        <div className="w-full max-w-md bg-blue-500 p-6 rounded-b-lg text-white text-center mt-4">
          <h1 className="text-xl font-bold">Bem-vindo, {session?.user?.name}</h1>
          <p className="text-sm">Gerenciamento de Assinaturas</p>
        </div>

        {/* Ícones e Funcionalidades */}
        <div className="flex flex-wrap justify-center mt-8 max-w-md w-full gap-4">
          <Button
            onClick={() => router.push("/upload")}
            className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg w-36 h-36"
          >
            <FaUpload className="text-4xl text-black" />
            <span className="mt-2 text-[#666]">UPLOAD</span>
          </Button>
          <Button
            onClick={() => router.push("/documents")}
            className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg w-36 h-36"
          >
            <FaFolderOpen className="text-4xl text-black" />
            <span className="mt-2 text-[#666]">DOCUMENTOS</span>
          </Button>
          <Button className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg w-36 h-36">
            <FaPen className="text-4xl text-black" />
            <span className="mt-2 text-[#666]">ASSINATURA</span>
          </Button>
          <Button className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg w-36 h-36">
            <FaUser className="text-4xl text-black" />
            <span className="mt-2 text-[#666]">PERFIL</span>
          </Button>
        </div>

        {/* Versão do App */}
        <p className="text-gray-500 mt-6">Versão 0.0.1</p>
      </main>
    </div>
  );
}
