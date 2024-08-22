"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import InputMask from "react-input-mask";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

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
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
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
            <InputMask
              mask="999.999.999-99"
              {...register("cpf")}
              placeholder="000.000.000-00"
            >
              {(inputProps: any) => <Input id="cpf" {...inputProps} />}
            </InputMask>
            {errors.cpf && <p className="text-red-500">{errors.cpf.message}</p>}
          </div>

          <div className="space-y-1 mb-2">
            <Label htmlFor="telefone">Telefone</Label>
            <InputMask
              mask="(99) 99999-9999"
              {...register("telefone")}
              placeholder="(00) 00000-0000"
            >
              {(inputProps: any) => <Input id="telefone" {...inputProps} />}
            </InputMask>
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
