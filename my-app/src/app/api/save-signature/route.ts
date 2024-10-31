// src/app/api/save-signature/route.ts

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, bucket } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Buffer } from "buffer";

export async function POST(request: NextRequest) {
    try {
        const { pdfUrl, signatureImage, documentId } = await request.json();

        if (!pdfUrl || !signatureImage || !documentId) {
            console.error("Dados ausentes. Certifique-se de fornecer o 'pdfUrl', 'signatureImage' e 'documentId'.");
            return NextResponse.json({ status: "error", message: "Dados ausentes." }, { status: 400 });
        }

        // Decodifica a assinatura de base64 para Buffer
        const signatureBuffer = Buffer.from(signatureImage.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const uniqueSignatureName = `${crypto.randomUUID()}-signature.png`;

        // Faz upload da assinatura para o S3
        const signatureCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: uniqueSignatureName,
            Body: signatureBuffer,
            ContentType: "image/png",
        });

        await s3.send(signatureCommand);
        const signatureUrl = `https://${bucket}.s3.amazonaws.com/${uniqueSignatureName}`;
        console.log("Assinatura salva com sucesso no S3:", signatureUrl);

        // Atualiza o documento no banco de dados com a URL da assinatura
        await prisma.document.update({
            where: { id: documentId },
            data: {
                isSigned: true,
                signatureUrl: signatureUrl,
            },
        });

        return NextResponse.json({
            status: "success",
            message: "Assinatura salva com sucesso!",
            signatureUrl,
        });
        
    } catch (error: any) {
        console.error("Erro ao salvar assinatura:", error);
        return NextResponse.json({
            status: "error",
            message: error.message || "Erro ao salvar a assinatura.",
        }, {
            status: 500,
        });
    }
}
