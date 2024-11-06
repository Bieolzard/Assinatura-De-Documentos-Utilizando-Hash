import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { documentExists, saveDocument } from "@/tcc-back/server/db";
import path from "path";
import { spawn } from "child_process";

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

        const exists = await documentExists(documentHash);
        console.log("Documento já existe:", exists);
        if (exists) {
            return NextResponse.json(
                { message: "Este documento já foi enviado ao blockchain." },
                { status: 400 }
            );
        }

        // await saveDocument(documentHash);
        // console.log("Documento salvo no banco de dados com hash:", documentHash);

        const interactPath = path.join(process.cwd(), 'src', 'tcc-back', 'interact.js');
        const nodePath = `"C:\\Program Files\\nodejs\\node.exe"`;
        const args = [interactPath, documentHash];

        console.log("Executando script interact.js com o comando:", `${nodePath} ${args.join(" ")}`);

        await new Promise((resolve, reject) => {
            const child = spawn(nodePath, args, { shell: true });

            child.stdout.on("data", (data) => {
                console.log(`Saída do script interact.js: ${data}`);
            });

            child.stderr.on("data", (data) => {
                console.error(`Erro no script interact.js: ${data}`);
            });

            child.on("error", (error) => {
                console.error(`Erro ao iniciar o script interact.js: ${error.message}`);
                reject(new Response(`Erro ao iniciar interact.js: ${error.message}`, { status: 500 }));
            });

            child.on("close", (code) => {
                if (code === 0) {
                    console.log("Script interact.js finalizado com sucesso.");
                    resolve(null);
                } else {
                    console.error(`Script interact.js finalizado com erro. Código de saída: ${code}`);
                    reject(new Response(`Erro ao executar interact.js. Código de saída: ${code}`, { status: 500 }));
                }
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
