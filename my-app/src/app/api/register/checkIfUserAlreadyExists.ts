import prisma from "@/lib/prisma";

export async function checkIfUserAlreadyExists(email: string, phone: string, cpf: string) {

    const user = await prisma.user.findFirst({
        where: {
            OR: [

                { email },
                { phone },
                { cpf }
            ]
        }
    })

    if (user) {
        return true
    }

    return false
}