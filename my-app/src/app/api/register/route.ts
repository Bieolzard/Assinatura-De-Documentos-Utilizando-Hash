import { FormData } from "@/app/register/page";
import { NextResponse } from "next/server";
import * as bcrypt from 'bcryptjs'
import prisma from "@/lib/prisma";
import { checkIfUserAlreadyExists } from "./checkIfUserAlreadyExists";

export async function POST(request: Request) {
    try {
        const body = await request.json() as FormData
        const hashPassword = await bcrypt.hash(body.senha, 8)
        const userAlreadyExists = await checkIfUserAlreadyExists(body.email, body.telefone, body.cpf)

        if (userAlreadyExists) {
            return NextResponse.json({
                status: 'error',
                message: 'Usuário já existe!',
                error: 'Usuário já existe',
                data: null
            },
                {
                    status: 409
                }
            )
        }


        const user = await prisma.user.create({
            data: {
                password: hashPassword,
                cpf: body.cpf,
                name: body.nome,
                phone: body.telefone,
                email: body.email
            }
        })

        const { password, ...userWithNoPassword } = user

        return NextResponse.json({
            status: 'success',
            message: 'Usuário criado com sucesso!',
            error: null,
            data: userWithNoPassword
        },
            {
                status: 201
            }
        )
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Houve um erro ao cadastrar o usuário, tente outra vez',
            error: error.message,
            data: null
        },
            {
                status: 500
            }
        )
    }
}