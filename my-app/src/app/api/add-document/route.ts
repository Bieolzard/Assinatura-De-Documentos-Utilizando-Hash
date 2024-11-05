import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { documentExists, saveDocument } from "@/tcc-back/server/db";
import path from "path";
import { exec } from "child_process";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Usuário não autenticado." },
                { status: 401 }
            );
        }

        const { documentHash } = await request.json();
        console.log("Document Hash recebido:", documentHash);

        if (!documentHash) {
            return NextResponse.json(
                { message: "O hash do documento é obrigatório." },
                { status: 400 }
            );
        }

        // Verifica se o documento já existe
        const exists = await documentExists(documentHash);
        console.log("Documento já existe:", exists); // Log para verificação
        if (exists) {
            return NextResponse.json(
                { message: "Este documento já foi enviado ao blockchain." },
                { status: 400 }
            );
        }

        // Salva o documento no banco de dados
        await saveDocument(documentHash);
        console.log("Documento salvo no banco de dados com hash:", documentHash);

        // Executar o script interact.js para adicionar o documento ao blockchain
        const interactPath = path.join(process.cwd(), 'src', 'tcc-back', 'interact.js');
        console.log("Caminho do interact.js:", interactPath);

        await new Promise((resolve, reject) => {
            exec(`node ${interactPath} ${documentHash}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro ao executar interact.js: ${error.message}`);
                    return reject(new Response('Erro ao executar interact.js', { status: 500 }));
                }
                if (stderr) {
                    console.error(`Erro no script: ${stderr}`);
                    return reject(new Response('Erro no script', { status: 500 }));
                }
                console.log(`Script output: ${stdout}`);
                resolve(stdout);
            });
        });

        return NextResponse.json(
            { message: "Documento adicionado com sucesso." },
            { status: 200 }
        );

    } catch (error) {
        console.error("Erro ao adicionar documento:", error);
        return NextResponse.json(
            { message: "Erro ao adicionar documento." },
            { status: 500 }
        );
    }
}
