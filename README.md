# Be The Hero

Projeto desenvolvido durante a **Semana Omnistack #11** (Rocketseat). A ideia é
simples: ONGs cadastram casos/incidentes que precisam de ajuda, e pessoas
dispostas a ajudar ("heróis") encontram esses casos e entram em contato
diretamente com a ONG responsável.

O projeto é dividido em três frentes independentes que conversam entre si
através de uma API REST:

| Frente | Público | Stack | Pasta |
|---|---|---|---|
| [Backend](#backend) | — (API) | Node.js + Express + Knex + SQLite | [`backend/`](backend) |
| [Frontend](#frontend) | ONGs | React + Create React App | [`frontend/`](frontend) |
| [Mobile](#mobile) | Heróis (voluntários) | React Native + Expo | [`mobile/`](mobile) |

```
Frontend (ONGs) ──┐
                   ├──► Backend (API REST + SQLite) ◄── Mobile (Heróis)
```

- Uma ONG se cadastra e faz login pelo **frontend**, e cadastra os incidentes
  que precisam de ajuda.
- Um herói navega pelos incidentes disponíveis no **mobile**, e ao decidir
  ajudar, o app abre o e-mail/WhatsApp de contato da ONG responsável.
- O **backend** é quem guarda tudo isso e expõe a API que os outros dois
  consomem.

---

## Backend

API REST responsável por autenticação simples de ONGs e pelo CRUD de
incidentes.

**Stack:** Express 4, Knex 2 (query builder) + SQLite 3 (banco), Celebrate/Joi
(validação de request), Jest + Supertest (testes).

```
backend/src/
├── app.js                 # configuração do Express (cors, json, rotas)
├── server.js               # ponto de entrada (app.listen)
├── routes.js                # definição de todas as rotas + validação
├── controllers/
│   ├── SessionController.js   # "login" da ONG (troca id por confirmação)
│   ├── OngController.js       # listar / cadastrar ONGs
│   ├── ProfileController.js   # dados da ONG autenticada
│   └── IncidentController.js  # listar / criar / remover incidentes
└── database/
    ├── connection.js          # instância do Knex
    └── migrations/            # schema (ongs, incidents)
```

### API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/sessions` | "Login" — recebe o `id` da ONG e confirma se ela existe |
| `GET` | `/ongs` | Lista todas as ONGs cadastradas |
| `POST` | `/ongs` | Cadastra uma nova ONG (`name`, `email`, `whatsapp`, `city`, `uf`) |
| `GET` | `/profile` | Retorna o nome da ONG autenticada (header `Authorization: <ong_id>`) |
| `GET` | `/incidents` | Lista incidentes (paginado, 5 por página, com dados da ONG) |
| `POST` | `/incidents` | Cria um incidente para a ONG autenticada |
| `DELETE` | `/incidents/:id` | Remove um incidente (só o dono pode remover) |

A autenticação é bem simples de propósito (didático): não há JWT, o próprio
`id` da ONG é enviado no header `Authorization` e usado como identificador.

### Rodando localmente

```bash
cd backend
npm install
npm start          # nodemon src/server.js — sobe em http://localhost:3333
npm test            # roda a suíte Jest (tests/unit e tests/integration)
```

O `sqlite3` precisa compilar um binário nativo na instalação. Se o seu
gerenciador de pacotes bloquear scripts de instalação por padrão, rode
`npm rebuild sqlite3` depois do `npm install`.

O banco (`src/database/db.sqlite`) e as migrations já estão versionados —
não é necessário rodar `knex migrate` para começar a usar.

**Status de dependências:** 0 vulnerabilidades conhecidas (`npm audit`).

---

## Frontend

Painel web usado pelas ONGs para se cadastrar e gerenciar seus incidentes.

**Stack:** React 16 + react-router-dom, axios (consumo da API), Create React
App 5 (build/dev server).

```
frontend/src/
├── App.js / routes.js       # roteamento
├── services/api.js          # instância do axios (baseURL do backend)
└── pages/
    ├── Logon/                # tela de login da ONG
    ├── Register/              # cadastro de nova ONG
    ├── Profile/               # lista de incidentes da ONG logada
    └── NewIncident/           # formulário de novo incidente
```

### Rodando localmente

```bash
cd frontend
npm install
npm start    # abre em http://localhost:3000
npm run build # build de produção em frontend/build
```

O frontend espera o backend rodando em `http://localhost:3333`
(`src/services/api.js`) — suba o backend antes.

**Status de dependências:** Create React App foi descontinuado pelo time do
React e não recebe mais atualizações. Restam ~28 vulnerabilidades presas em
dependências internas do `react-scripts` (postcss, svgo, webpack-dev-server,
workbox etc.) sem correção possível enquanto o projeto usar CRA — todas são
ferramentas de build/dev, não código que vai para o bundle de produção. Sair
dessa situação exigiria migrar o toolchain para outra ferramenta (ex. Vite).

---

## Mobile

App usado pelos heróis para navegar pelos incidentes e entrar em contato com
a ONG responsável.

**Stack:** Expo SDK 38 + React Native, React Navigation (stack), axios
(consumo da API).

```
mobile/src/
├── routes.js                 # navegação (stack)
├── services/api.js           # instância do axios (baseURL do backend)
└── pages/
    ├── Login/                 # tela de login da ONG
    ├── Register/                # cadastro de nova ONG
    ├── Incidents/                # lista de incidentes disponíveis
    └── Detail/                   # detalhe do incidente + contato (e-mail)
```

### Rodando localmente

```bash
cd mobile
npm install
npm start    # abre o Expo Dev Tools (Metro bundler)
```

Ajuste o IP em `src/services/api.js` (`baseURL`) para o IP da sua máquina na
rede local — dispositivos físicos/emuladores não enxergam `localhost`.

**Status de dependências:** ainda não revisado nesta rodada (fica para uma
próxima). O app está preso no Expo SDK 38 (2020); fechar as vulnerabilidades
remanescentes exigiria migrar para uma versão atual do Expo SDK — um projeto
de migração maior, não um bump simples, já que muda formato de config, APIs
e a versão do React Native junto.
