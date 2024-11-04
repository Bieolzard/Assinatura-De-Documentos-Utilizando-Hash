import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        // Obtém a sessão do usuário
        const session = await getServerSession(authOptions);
        if (!session) {
            // Retorna erro se o usuário não estiver autenticado
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

        // Busca o documento pelo ID
        const document = await prisma.document.findUnique({
            where: { id: params.id },
        });

        // Verifica se o documento existe
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

        // Retorna o documento encontrado
        return NextResponse.json({
            status: "ok",
            message: "Documento carregado com sucesso!",
            data: {
                ...document, // Aqui deve conter a signatureUrl
                signatureUrl: document.signatureUrl, // Certifique-se de que essa propriedade existe
            },
        });
    } catch (error: any) {
        // Log de erro para depuração
        console.error("Erro ao carregar documento:", error);
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
