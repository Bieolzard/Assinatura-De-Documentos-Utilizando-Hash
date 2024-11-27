Sistema de Validação e Assinaturas por Blockchain - TCC

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) e consiste em um sistema de upload, visualização, e assinatura de arquivos. A aplicação foi desenvolvida utilizando as seguintes tecnologias:

React para o front-end;

ShadCN UI para componentes de interface do usuário;

Prisma ORM/MongoDB para a manipulação do banco de dados;

NEXT API para comunicação entre o front-end e o back-end;

Amazon S3 para armazenamento de arquivos.

FUNCIONALIDADES

Upload de documentos em formato PDF;

Conversão de PDFs para imagens para visualização direta no navegador;

Assinatura digital de documentos;

Visualização dos documentos;

Sistema de autenticação com cadastro e login;

Simulação de envio para um simulador blockchain ao enviar o documento tanto assinado quanto não;

Disponibilização online do documento

Como Rodar o Projeto

Clone o repositório:

git clone https://github.com/SEU_USUARIO/seu-projeto.git

Instale as dependências:

cd my-app

pnpm install

Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto e insira as seguintes variáveis:

DATABASE_URL="[sua-url-do-banco]"
NEXTAUTH_SECRET="[seu-segredo]"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
NEXT_PUBLIC_AWS_REGION='[sua-regiao-aws]'
NEXT_PUBLIC_AWS_ACCESS_KEY_ID='[sua-chave-de-acesso]'
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY='[sua-chave-secreta]'
NEXT_PUBLIC_AWS_BUCKET='[seu-nome-do-bucket]'

Simulador
Baixe o simulador de blockchain ganache https://archive.trufflesuite.com/ganache/
Rode ele e certifique-se que o projeto está rodando na mesma porta que o ganache, para que seja feito o envio dos documentos a rede blockchain

Execute a aplicação:

pnpm run dev

Autor

Este projeto foi desenvolvido por Gabriel Mateus de Andrade e Hugo Lima de Oliveira Frizo.
