# Sistema de Validação e Assinaturas por Blockchain - TCC

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) e consiste em um sistema de upload, visualização e assinatura de arquivos. A aplicação foi desenvolvida utilizando as seguintes tecnologias:

- **React** para o front-end;
- **ShadCN UI** para componentes de interface do usuário;
- **Prisma ORM/MongoDB** para a manipulação do banco de dados;
- **NEXT API** para comunicação entre o front-end e o back-end;
- **Amazon S3** para armazenamento de arquivos.

---

## TCC
Link do TCC: [VALIDAÇÃO DE ASSINATURAS DIGITAIS UTILIZANDO BLOCKCHAIN E HASH](https://courseware.fho.edu.br/repositorio-publico/eyJpdiI6ImZPTStxaTFrRUsyZnBvTERwaXBJd1E9PSIsInZhbHVlIjoicjd0Z2pIZGUrT2diVEo4WENJMW9wUT09IiwibWFjIjoiOTRjYmJhNTBiN2Q3YmY0YmFhMDAxY2YyZTJmOWVkN2M4MjQyZjA1YTRiY2RmMDg0NTI0NmJmYWMxMTc2NzM1MiIsInRhZyI6IiJ9?search=Blockchain)

## Funcionalidades

- Upload de documentos em formato PDF;
- Conversão de PDFs para imagens para visualização direta no navegador;
- Assinatura digital de documentos;
- Visualização dos documentos;
- Sistema de autenticação com cadastro e login;
- Simulação de envio para um simulador blockchain ao enviar o documento (assinado ou não);
- Disponibilização online do documento.

---

## Como Rodar o Projeto

### Clone o repositório:

```bash
git clone https://github.com/Bieolzard/Assinatura-De-Documentos-Utilizando-Hash.git
```
### Simulador
Baixe o simulador de blockchain Ganache:
https://archive.trufflesuite.com/ganache/

Certifique-se de que o projeto está rodando na mesma porta que o Ganache para que os documentos sejam enviados para a rede blockchain.

## Execute a aplicação
```bash
pnpm run dev
```
### Autor
Este projeto foi desenvolvido por Gabriel Mateus de Andrade e Hugo Lima de Oliveira Frizo.
