"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUpload, FaSignOutAlt, FaHome } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  // Função para lidar com o logout
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
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
              <a onClick={handleLogout} className="flex items-center cursor-pointer">
                <FaSignOutAlt className="mr-2" /> Sair
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex flex-col items-center justify-center p-4">
        {/* Cabeçalho de Boas-vindas */}
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg text-white text-center mt-4 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Bem-vindo, {session?.user?.name}</h1>
          <p className="text-sm">Gerenciamento de Assinaturas</p>
        </div>

        {/* Card de Upload */}
        <div className="flex flex-col items-center mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Realize seu Upload</h2>
            <Button
              onClick={() => router.push("/upload")}
              className="flex items-center justify-center p-4 bg-gray-800 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              <FaUpload className="mr-2" /> Upload
            </Button>
          </div>
        </div>

        {/* Versão do App */}
        <p className="text-gray-500 mt-6">Versão 0.0.1</p>
      </main>
    </div>
  );
}
