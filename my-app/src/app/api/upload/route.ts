import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, bucket } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { Buffer } from "buffer";

export async function POST(request: NextRequest) {
    try {
        console.log("Iniciando o upload do PDF para o S3...");

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.error("Nenhum arquivo selecionado.");
            throw new Error("Nenhum arquivo enviado.");
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            console.error("Usuário não autenticado.");
            throw new Error("Usuário não autenticado.");
        }

        // Converte o arquivo PDF em ArrayBuffer e Buffer
        const pdfArrayBuffer = await file.arrayBuffer();
        const pdfBuffer = Buffer.from(pdfArrayBuffer);
        const uniqueFileName = `${crypto.randomUUID()}-${file.name}`;

        // Comando para salvar o PDF no S3
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: uniqueFileName,
            Body: pdfBuffer,
            ContentType: file.type,
        });

        await s3.send(command);
        const fileUrl = `https://${bucket}.s3.amazonaws.com/${uniqueFileName}`;
        console.log("PDF enviado com sucesso para o S3:", fileUrl);

        // Salva as informações no banco de dados
        console.log("Salvando informações do documento no banco de dados...");
        const document = await prisma.document.create({
            data: {
                userId: session.user.id,
                filePath: fileUrl,
                imagePath: null,
                fileType: "pdf",
                isSigned: false,
                name: file.name,
            }
        });
        
        return NextResponse.json({
            status: "success",
            message: "Upload do PDF concluído com sucesso!",
            fileUrl,
            documentId: document.id, // Adiciona o `documentId` retornado para o frontend
        });
        
    } catch (error: any) {
        console.error("Erro no upload:", error);
        return NextResponse.json({
            status: "error",
            message: error.message || "Erro ao carregar o documento. Tente outra vez.",
        }, {
            status: 500,
        });
    }
}
