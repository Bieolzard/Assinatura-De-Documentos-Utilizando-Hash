import { bucket, s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import NextAuth from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const body = (await file.arrayBuffer()) as Buffer
        const uniqueFileName = `${crypto.randomUUID()}-${file.name}`
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: uniqueFileName,
            Body: body
        })
        const response = await s3.send(command)
        const url = `https://${bucket}.s3.amazonaws.com/${uniqueFileName}`;
        const session = await getServerSession(authOptions)
        await prisma.document.create({
            data: {
                userId: session?.user.id!,
                filePath: url,
                fileType: 'pdf',
                isSigned: false,
                name: file.name,
            }
        })
        return NextResponse.json(response)

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