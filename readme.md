# Letmeask API

## Introdução

Uma API autodocumentável construída com Fastify para a plataforma Letmeask, permitindo a criação e gerenciamento de salas, perguntas e áudios.

## Tecnologias

- Linguagem: [Node.js](https://nodejs.org)
- Framework: [Fastify.js](https://www.fastify.io)
- ORM: [Drizzle ORM](https://orm.drizzle.team/)
- Documentação: [Swagger (OpenAPI)](https://swagger.io/)
- Banco de Dados: [PostgreSQL](https://www.postgresql.org)
- Gerenciamento de Dependências: [pnpm](https://pnpm.io)
- Linter: [Biome](https://biomejs.dev/)
- Testes: (adicione aqui se houver)

## Estrutura do Projeto

| Diretório/Arquivo      | Descrição                                 |
| ---------------------- | ----------------------------------------- |
| **docker/**            | Configuração de containers Docker         |
| **src/**               | Código-fonte principal da aplicação       |
| └─ **db/**             | Configuração e schemas do banco de dados  |
| └─ **http/**           | Rotas e handlers HTTP                     |
| └─ **schemas/**        | Esquemas de validação de dados            |
| └─ **services/**       | Camada de serviços e integrações externas |
| └─ **utils/**          | Funções utilitárias e helpers             |
| └─ **server.ts**       | Inicialização e configuração do servidor  |
| **.env**               | Variáveis de ambiente                     |
| **docker-compose.yml** | Orquestração de containers                |
| **package.json**       | Gerenciamento de dependências             |

## Endpoints

| Método   | Endpoint                    | Descrição                                 |
| -------- | --------------------------- | ----------------------------------------- |
| **GET**  | `/rooms`                    | Listar todas as salas                     |
| **POST** | `/rooms`                    | Criar uma nova sala                       |
| **GET**  | `/rooms/{roomId}`           | Buscar sala pelo ID                       |
| **POST** | `/rooms/{roomId}/questions` | Criar uma nova pergunta em uma sala       |
| **POST** | `/rooms/{roomId}/audio`     | Fazer upload de um novo áudio em uma sala |

## Instalação

Crie uma fork do repositório:

Acesse: https://github.com/izaiasmorais/letmeask-api/fork

Clone o repositório na sua máquina:

```bash
git clone https://github.com/[seu usuário]/letmeask-api
```

Acesse o projeto:

```bash
cd letmeask-api
```

Instale as dependências:

```bash
pnpm install
```

Configure o arquivo .env com suas credenciais (baseando-se no .env.example):

```env
VERSION=1.0.0
PORT=3333
NODE_ENV="developer"
GEMINI_API_KEY=""
DATABASE_URL="postgresql://docker:docker@localhost:5432/letmeask"
```

## Executando o Projeto

Rode o banco postgres no docker (caso não já possua um postgres em outro serviço):

```bash
docker compose up -d
```

Suba as migrações para o banco:

```bash
pnpm migrate
```

Inicie o servidor:

```bash
pnpm dev
```

Acesse a documentação interativa (Swagger):

```
http://localhost:3333/json
```

## Executando os Testes

(Adicione instruções aqui caso haja testes configurados, por exemplo:)

```bash
pnpm test
```
