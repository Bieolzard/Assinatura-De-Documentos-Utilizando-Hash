import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";



export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({
                status: 'error',
                message: 'Usuário não autenticado',
                error: null,
                data: null
            }, {
                status: 401
            })
        }
        const documents = await prisma.document.findMany({
            where: {
                userId: session.user.id
            }
        })
        console.log(documents)
        return NextResponse.json({
            status: 'ok',
            message: 'Documentos carregados com sucesso!',
            data: documents
        })
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Houve um erro ao carregar o documento, tente outra vez',
            error: error.message,
            data: null
        },
            {
                status: 500
            }
        )
    }
}