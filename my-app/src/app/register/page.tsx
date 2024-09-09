"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { useHookFormMask } from 'use-mask-input'
import { api } from "@/lib/axios";
import { toast } from "sonner";
import errorMap from "zod/locales/en.js";
import { isAxiosError } from "axios";
import { signIn } from "next-auth/react";

// Definindo o esquema de validação Zod
const schema = z.object({
  nome: z.string()
    .nonempty({ message: "Nome é obrigatório" })
    .regex(/^[A-Za-z\s]+$/, { message: "Nome só pode conter letras e espaços" }),
  cpf: z.string()
    .nonempty({ message: "CPF é obrigatório" })
    .refine((value) => cpfValidator.isValid(value), {
      message: "CPF inválido",
    }),
  telefone: z.string()
    .nonempty({ message: "Telefone é obrigatório" })
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, { message: "Telefone inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

// Tipagem dos dados do formulário
export type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const registerWithMask = useHookFormMask(register)

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post('/api/register', data)
      if (response.status === 201) {
        toast.success(response.data.message)
        const email = data.email
        const password = data.senha
        await signIn('credentials', { callbackUrl: '/home', email, password })
      }
      console.log(response)
    } catch (error) {

      if (isAxiosError(
        error
      )) {
        if (error.status === 409) {
          toast.error(error.response?.data.message
          )
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrar-se</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1 mb-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register("nome")} placeholder="Nome completo" />
            {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
          </div>

          <div className="space-y-1 mb-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input {...registerWithMask('cpf', ['999.999.999-99'])} placeholder="000.000.000-00" id='cpf' />
            {errors.cpf && <p className="text-red-500">{errors.cpf.message}</p>}
          </div>

          <div className="space-y-1 mb-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input {...registerWithMask('telefone', ['(99) 99999-9999'])} placeholder="(00) 00000-0000" id="telefone" />
            {errors.telefone && <p className="text-red-500">{errors.telefone.message}</p>}
          </div>

          <div className="space-y-1 mb-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} placeholder="seuemail@exemplo.com" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1 mb-4">
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" {...register("senha")} placeholder="Senha" />
            {errors.senha && <p className="text-red-500">{errors.senha.message}</p>}
          </div>

          <Button type="submit" className="w-full">Registrar</Button>
        </form>
        <p className="mt-4 text-center">
          Já tem uma conta? <Link href="/login" className="text-blue-500">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
