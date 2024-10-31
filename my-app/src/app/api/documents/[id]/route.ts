import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { NextAuthOptions } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Usuário não autenticado",
                    data: null,
                },
                {
                    status: 401,
                }
            );
        }

        const document = await prisma.document.findUnique({
            where: { id: params.id },
        });

        if (!document) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Documento não encontrado",
                    data: null,
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            status: "ok",
            message: "Documento carregado com sucesso!",
            data: document,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                status: "error",
                message: "Erro ao carregar documento",
                error: error.message,
                data: null,
            },
            {
                status: 500,
            }
        );
    }
}
