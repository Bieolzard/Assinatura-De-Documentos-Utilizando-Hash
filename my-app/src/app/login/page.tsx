"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";


export default function LoginPage() {
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const alternarVisibilidadeSenha = () => {
        setSenhaVisivel(!senhaVisivel);
      };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form>
          <div className="space-y-1 mb-2">
            <Label htmlFor="email">
              Email
            </Label>
            <Input type="email" id="email" placeholder="Email" required />
          </div>
          <div className="space-y-1 mb-4 relative">
            <Label htmlFor="senha">
              Senha
            </Label>
            <Input
              type={senhaVisivel ? "text" : "password"}
              id="senha"
              placeholder="Informe sua senha"
              required
            />
            <div
              className="absolute mx-auto top-[2.3vw] right-0 pr-5 flex items-center cursor-pointer"
              onClick={alternarVisibilidadeSenha}
            >
              {senhaVisivel ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
        <p className="mt-4 text-center">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-blue-500">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
