import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, bucket } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// Função para criar um job na CloudConvert
async function createCloudConvertJob(fileUrl: string) {
    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    const response = await fetch("https://api.cloudconvert.com/v2/jobs", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tasks: {
                "import-my-file": {
                    "operation": "import/url",
                    "url": fileUrl,
                },
                "convert-my-file": {
                    "operation": "convert",
                    "input": "import-my-file",
                    "input_format": "pdf",
                    "output_format": "png", // ou "jpg"
                },
                "export-my-file": {
                    "operation": "export/s3",
                    "input": "convert-my-file",
                    "bucket": bucket,
                    "region": process.env.NEXT_PUBLIC_AWS_REGION,
                    "access_key_id": process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
                    "secret_access_key": process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
                },
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`CloudConvert error: ${await response.text()}`);
    }

    return await response.json();
}

// Handler POST para o upload do arquivo e criação do job
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        // 1. Fazer upload para o S3 (aqui você pode optar por fazer o upload do PDF ou apenas pegar a URL)
        const uploadResult = await uploadFileToS3(file);
        const fileUrl = uploadResult.url;

        const session = await getServerSession(authOptions); // Obtém a sessão do usuário

        // 2. Criar o job na CloudConvert
        const jobData = await createCloudConvertJob(fileUrl);

        // Aqui, você pode querer verificar o status do job e obter as URLs das imagens convertidas.

        // 3. Salvar no banco de dados (apenas o PDF por enquanto, você pode ajustar isso mais tarde)
        await prisma.document.create({
            data: {
                userId: session?.user.id!,
                filePath: fileUrl,
                fileType: 'pdf',
                isSigned: false,
                name: file.name,
            }
        });

        return NextResponse.json(jobData); // Retorna os dados do job

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Houve um erro ao carregar o documento, tente outra vez',
            error: error.message,
            data: null,
        }, {
            status: 500,
        });
    }
}

// Função para fazer upload do arquivo para o S3
async function uploadFileToS3(file: File): Promise<{ url: string }> {
    const body = await file.arrayBuffer(); // Obter o conteúdo do arquivo
    const uniqueFileName = `${crypto.randomUUID()}-${file.name}`; // Nome único para o arquivo

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: uniqueFileName,
        Body: body,
    });

    await s3.send(command); // Envia o arquivo para o S3

    // Retorna um objeto contendo a URL do arquivo no S3
    return { url: `https://${bucket}.s3.amazonaws.com/${uniqueFileName}` };
}