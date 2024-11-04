import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
    try {
        // Obtém a sessão do usuário
        const session = await getServerSession(authOptions);
        if (!session) {
            // Retorna um erro se o usuário não estiver autenticado
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Usuário não autenticado',
                    error: null,
                    data: null
                },
                {
                    status: 401
                }
            );
        }

        // Busca os documentos do usuário
        const documents = await prisma.document.findMany({
            where: {
                userId: session.user.id
            }
        });

        // Log para depuração
        console.log('Documentos do usuário:', documents);

        // Retorna os documentos encontrados
        return NextResponse.json({
            status: 'ok',
            message: 'Documentos carregados com sucesso!',
            data: documents
        });
    } catch (error: any) {
        // Retorna um erro em caso de falha
        console.error("Erro ao carregar documentos:", error); // Log de erro para depuração
        return NextResponse.json({
            status: 'error',
            message: 'Houve um erro ao carregar os documentos, tente novamente',
            error: error.message,
            data: null
        }, {
            status: 500
        });
    }
}
