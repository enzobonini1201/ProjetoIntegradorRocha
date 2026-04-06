# Sistema Rocha Transportes

Guia completo para executar o projeto **backend + frontend** em ambiente local Windows.

## 1) Tecnologias usadas

- **Backend:** Java 17+, Spring Boot 3.1.4, Spring Security (JWT), Spring Data JPA, PostgreSQL
- **Frontend:** Angular 17, TypeScript, RxJS, Bootstrap 5, Bootstrap Icons
- **Build tools:** Maven e npm

## 2) Pré-requisitos obrigatórios

Instale antes de executar:

1. **PostgreSQL** (recomendado 12+)
2. **JDK** 17+ (o projeto compila com `java.version=17`)
3. **Node.js** 18+ (com npm)

> Observação: o script `backend/start-backend.ps1` tenta usar o Java em:
>
> `C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot`
>
> Se seu Java estiver em outro caminho, altere a variável `$javaPath` dentro desse script.

## 3) Configuração do banco de dados

O backend usa por padrão (`backend/src/main/resources/application.properties`):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/db_rocha
spring.datasource.username=postgres
spring.datasource.password=root
```

### 3.1 Criar banco

```sql
CREATE DATABASE db_rocha;
```

### 3.2 Ajustar credenciais

Se seu usuário/senha do PostgreSQL forem diferentes, edite o arquivo:

`backend/src/main/resources/application.properties`

e ajuste `spring.datasource.username` e `spring.datasource.password`.

### 3.3 Sobre script SQL inicial

Existe o arquivo `backend/db_rocha_postgres.sql`, porém o projeto já está com
`spring.jpa.hibernate.ddl-auto=update`, então o Hibernate cria/atualiza schema automaticamente.

**Fluxo recomendado para rodar sem conflito:**
- criar apenas o banco vazio `db_rocha`
- iniciar o backend (Hibernate cria/ajusta tabelas)

## 4) Como rodar o backend

No PowerShell, na pasta `backend`:

```powershell
cd "c:\Users\lgtgu\OneDrive\Área de Trabalho\SistemaRocha\backend"
.\start-backend.ps1
```

Se preferir sem script:

```powershell
cd "c:\Users\lgtgu\OneDrive\Área de Trabalho\SistemaRocha\backend"
.\mvnw.cmd spring-boot:run
```

Backend disponível em:

- `http://localhost:8080`

## 5) Como rodar o frontend

No PowerShell, na pasta `frontend`:

```powershell
cd "c:\Users\lgtgu\OneDrive\Área de Trabalho\SistemaRocha\frontend"
npm install
npm start
```

Frontend disponível em:

- `http://localhost:4200`

## 6) Primeira execução (login/cadastro)

### 6.1 Não dependa de usuário fixo

Apesar de existir inserção de `admin` no SQL legado, o fluxo atual do sistema usa cadastro moderno por CPF e senha BCrypt.

### 6.2 Faça o cadastro pela tela

1. Abra `http://localhost:4200`
2. Vá em **Cadastro**
3. Informe nome, CPF e senha

Regras de senha (backend valida):
- mínimo 8 caracteres
- pelo menos 1 maiúscula
- pelo menos 1 minúscula
- pelo menos 1 número
- pelo menos 1 especial: `@#$%^&+=!`

### 6.3 Faça login

- Login: **CPF** (com ou sem máscara)
- Senha: a cadastrada

## 7) Endpoints principais

### Autenticação e usuário
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me` (autenticado)
- `PUT /api/auth/me` (autenticado)
- `PUT /api/auth/senha` (autenticado)
- `POST /api/usuarios/cadastro` (público)
- `POST /api/usuarios/recuperar-senha` (público)

### CRUDs protegidos por JWT
- `GET|POST /api/motoristas`
- `GET|PUT|DELETE /api/motoristas/{id}`
- `GET|POST /api/agregados`
- `GET|PUT|DELETE /api/agregados/{id}`
- `GET|POST /api/ajudantes`
- `GET|PUT|DELETE /api/ajudantes/{id}`
- `GET|POST /api/clientes`
- `GET|PUT|DELETE /api/clientes/{id}`
- `GET|POST /api/transportes`
- `GET|PUT|DELETE /api/transportes/{id}`
- `GET|POST /api/notas`
- `GET|PUT|DELETE /api/notas/{id}`
- `GET|POST /api/rotas`
- `GET|PUT|DELETE /api/rotas/{id}`

## 8) Ordem exata para subir tudo

1. Subir PostgreSQL
2. Criar DB `db_rocha`
3. Ajustar `application.properties` (se necessário)
4. Iniciar backend (`start-backend.ps1` ou `mvnw.cmd spring-boot:run`)
5. Iniciar frontend (`npm install` + `npm start`)
6. Acessar `http://localhost:4200`
7. Cadastrar usuário e logar com CPF

## 9) Problemas comuns

### Erro de conexão com banco
- confira se PostgreSQL está ativo
- confirme URL/usuário/senha em `application.properties`

### Porta 8080 ocupada
- altere em `backend/src/main/resources/application.properties`:
	- `server.port=8081`
- ajuste também o frontend (`frontend/src/environments/environment.ts`):
	- `apiUrl: 'http://localhost:8081/api'`

### Porta 4200 ocupada

```powershell
cd "c:\Users\lgtgu\OneDrive\Área de Trabalho\SistemaRocha\frontend"
npx ng serve --port 4201
```

Se mudar a porta do frontend, ajuste CORS no backend (`cors.allowed.origins`).

## 10) Estrutura resumida

```text
SistemaRocha/
├── backend/
│   ├── src/main/java/com/rochatransportes/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   └── security/
│   ├── src/main/resources/application.properties
│   ├── pom.xml
│   └── start-backend.ps1
└── frontend/
		├── src/app/components/
		├── src/app/services/
		├── src/app/guards/
		├── src/app/interceptors/
		├── src/environments/
		└── package.json
```

## 11) Execução rápida (2 terminais)

Use este fluxo quando já tiver PostgreSQL rodando e o banco `db_rocha` criado.

### Terminal 1 (backend)

```powershell
cd "c:\Users\lgtgu\OneDrive\Área de Trabalho\SistemaRocha\backend"
.\start-backend.ps1
```

### Terminal 2 (frontend)

```powershell
cd "c:\Users\lgtgu\OneDrive\Área de Trabalho\SistemaRocha\frontend"
npm install
npm start
```

### Acesso

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8080`

## 12) Checklist de validação (healthcheck)

Após subir os serviços, valide nesta ordem:

1. **Banco conectado**
	- no terminal do backend, confirme que não houve erro de conexão PostgreSQL.

2. **API no ar**
	- abra `http://localhost:8080` (deve responder, mesmo que com erro de rota padrão).

3. **Frontend no ar**
	- abra `http://localhost:4200` e confirme tela de login.

4. **Cadastro funcionando**
	- faça um cadastro em `/cadastro` com senha forte.

5. **Login funcionando**
	- autentique com CPF e senha cadastrados.

6. **JWT funcionando**
	- navegue para `/home`; se abrir sem redirecionar para login, autenticação está OK.

7. **CRUD protegido funcionando**
	- teste uma listagem (ex.: `/motoristas`) e confirme retorno sem erro 401/403.
