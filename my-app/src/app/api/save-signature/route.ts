import { PDFDocument } from 'pdf-lib'; // Adiciona importação da biblioteca pdf-lib
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, bucket } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Buffer } from "buffer";

export async function POST(request: NextRequest) {
    try {
        const { pdfUrl, signatureImage, documentId, position } = await request.json();

        if (!pdfUrl || !signatureImage || !documentId || !position) {
            console.error("Dados ausentes.");
            return NextResponse.json({ status: "error", message: "Dados ausentes." }, { status: 400 });
        }

        // Carrega o PDF original a partir da URL
        const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Adiciona a imagem da assinatura
        const pngImage = await pdfDoc.embedPng(signatureImage);
        const page = pdfDoc.getPage(0); // Altere o índice se for em outra página

        // Define a posição e dimensões da assinatura
        page.drawImage(pngImage, {
            x: position.x,
            y: position.y,
            width: 100, // Ajuste o tamanho conforme necessário
            height: 50,
        });

        // Gera o novo PDF com a assinatura
        const pdfWithSignature = await pdfDoc.save();
        const signedFileName = `${crypto.randomUUID()}-signed.pdf`;

        // Faz o upload do PDF assinado para o S3
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: signedFileName,
            Body: Buffer.from(pdfWithSignature),
            ContentType: "application/pdf",
        });
        await s3.send(command);

        const signedPdfUrl = `https://${bucket}.s3.amazonaws.com/${signedFileName}`;

        // Atualiza o documento no banco de dados
        await prisma.document.update({
            where: { id: documentId },
            data: {
                isSigned: true,
                signatureUrl: signedPdfUrl,
            },
        });

        return NextResponse.json({
            status: "success",
            message: "Documento assinado com sucesso!",
            signedPdfUrl,
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
