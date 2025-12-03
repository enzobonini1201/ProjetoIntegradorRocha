# Guia de Teste - Sistema de Cadastro e Recuperação de Senha

## 🎯 Funcionalidades Implementadas

### 1. Tela de Cadastro (`/cadastro`)
- Formulário completo de registro de usuário
- Campos: Nome Completo, CPF, Senha, Confirmar Senha
- Validações:
  - Nome: mínimo 3 caracteres
  - CPF: formato XXX.XXX.XXX-XX
  - Senha: mínimo 8 caracteres, deve conter maiúsculas, números e caracteres especiais
  - Confirmação: senhas devem ser iguais
- Máscara automática de CPF
- Toggle para mostrar/ocultar senha
- Design idêntico ao projeto dbrocha (split layout com logo)

### 2. Tela de Recuperação de Senha (`/recuperar-senha`)
- Formulário simples com campo de CPF
- Gera senha temporária automaticamente
- Exibe mensagem de sucesso com a nova senha
- Redirecionamento automático para login após 3 segundos
- Design dark theme matching dbrocha

### 3. Backend Endpoints

#### POST `/api/usuarios/cadastro`
**Request Body:**
```json
{
  "nomeCompleto": "João da Silva",
  "cpf": "123.456.789-10",
  "senha": "Senha@123",
  "confirmarSenha": "Senha@123"
}
```

**Response Success (200):**
```json
{
  "message": "Usuário cadastrado com sucesso! Use seu CPF para fazer login.",
  "login": "12345678910"
}
```

**Response Error (400):**
```json
{
  "message": "CPF já cadastrado no sistema"
}
```

#### POST `/api/usuarios/recuperar-senha`
**Request Body:**
```json
{
  "cpf": "123.456.789-10"
}
```

**Response Success (200):**
```json
{
  "message": "Sua nova senha temporária é: Ab3$xYz9Kl. Por favor, altere-a após o login.",
  "senhaTemporaria": "Ab3$xYz9Kl"
}
```

**Response Error (400):**
```json
{
  "message": "CPF não encontrado no sistema"
}
```

## 🚀 Como Testar

### Passo 1: Preparar o Banco de Dados

Se você já tem o banco criado, execute a migração:
```sql
-- No PostgreSQL (psql ou pgAdmin)
\c db_rocha
\i backend/migration_add_cpf.sql
```

Se está criando o banco do zero:
```sql
-- No PostgreSQL
CREATE DATABASE db_rocha;
\c db_rocha
\i backend/db_rocha_postgres.sql
```

### Passo 2: Iniciar o Backend

```powershell
# No terminal do VS Code, na pasta backend
cd backend
./mvnw.cmd spring-boot:run
```

Aguarde a mensagem: `Started RochaTransportesApplication`

### Passo 3: Iniciar o Frontend

```powershell
# Em outro terminal, na pasta frontend
cd frontend
npm start
```

Aguarde a mensagem: `Compiled successfully` e acesse http://localhost:4200

### Passo 4: Testar o Fluxo Completo

#### Teste 1: Cadastro de Novo Usuário
1. Na tela de login, clique em **"Cadastre-se"**
2. Preencha o formulário:
   - Nome: `Maria Santos`
   - CPF: `111.222.333-44` (a máscara formata automaticamente)
   - Senha: `Teste@2024`
   - Confirmar Senha: `Teste@2024`
3. Clique em **"CADASTRAR"**
4. Aguarde mensagem de sucesso
5. Será redirecionado para tela de login

#### Teste 2: Login com CPF
1. Na tela de login, digite:
   - Usuário: `11122233344` (CPF sem formatação)
   - Senha: `Teste@2024`
2. Clique em **"ENTRAR"**
3. Você deve ser redirecionado para a home

#### Teste 3: Recuperação de Senha
1. Na tela de login, clique em **"Esqueci minha senha"**
2. Digite o CPF: `111.222.333-44`
3. Clique em **"RECUPERAR SENHA"**
4. Anote a senha temporária exibida (ex: `Xy9#mK2pLs`)
5. Aguarde redirecionamento para login (3 segundos)
6. Faça login com:
   - Usuário: `11122233344`
   - Senha: `Xy9#mK2pLs` (a senha temporária)

#### Teste 4: Validações
1. **CPF já cadastrado**: Tente cadastrar o mesmo CPF novamente
2. **Senhas não conferem**: Digite senhas diferentes
3. **Senha fraca**: Tente senha sem maiúsculas ou especiais
4. **CPF inválido**: Digite CPF incompleto
5. **CPF não existe**: Tente recuperar senha de CPF não cadastrado

## 🔧 Troubleshooting

### Backend não inicia
```powershell
# Verifique se PostgreSQL está rodando
# Verifique as credenciais em backend/src/main/resources/application.properties
spring.datasource.username=postgres
spring.datasource.password=root
```

### Erro de CORS
- Verifique se o backend está em http://localhost:8080
- Verifique se o frontend está em http://localhost:4200
- Ambos devem estar rodando

### CPF não aceita formatação
- A máscara é aplicada automaticamente ao digitar
- O backend aceita CPF com ou sem formatação

### Senha não atende aos requisitos
A senha deve ter:
- ✅ Mínimo 8 caracteres
- ✅ Pelo menos 1 letra maiúscula (A-Z)
- ✅ Pelo menos 1 letra minúscula (a-z)
- ✅ Pelo menos 1 número (0-9)
- ✅ Pelo menos 1 caractere especial (!@#$%^&*...)

## 📋 Checklist de Implementação

### Frontend ✅
- [x] Componente de cadastro criado
- [x] Componente de recuperação de senha criado
- [x] Rotas configuradas (/cadastro, /recuperar-senha)
- [x] Componentes registrados no app.module.ts
- [x] Design matching dbrocha project
- [x] Validações de formulário
- [x] Máscara de CPF
- [x] Toggle de senha
- [x] HttpClient integrado

### Backend ✅
- [x] Modelo Usuario com campo CPF
- [x] DTOs criados (CadastroRequest, RecuperarSenhaRequest)
- [x] Repository com métodos de busca por CPF
- [x] Service com lógica de cadastro e recuperação
- [x] Controller com endpoints
- [x] Segurança configurada (endpoints públicos)
- [x] Script de migração do banco
- [x] Validação de senha forte
- [x] Geração de senha temporária

### Banco de Dados ✅
- [x] Coluna cpfUser adicionada
- [x] Constraint UNIQUE no CPF
- [x] Script de migração criado

## 🎨 Design

### Cadastro (Light Theme)
- Painel esquerdo: Logo + degradê azul (#e3f2fd → #bbdefb)
- Painel direito: Formulário branco com sombra
- Botão azul (#0099ff) com hover (#00c3ff)
- Animações smooth

### Recuperação (Dark Theme)
- Background: degradê escuro (#0a0e27 → #1a1f3a)
- Card semi-transparente com blur
- Inputs com bordas brilhantes
- Efeitos de glow

## 🔐 Segurança

- Senhas criptografadas com BCrypt
- JWT para autenticação
- Validação de força de senha
- CPF único no sistema
- Endpoints de registro públicos (sem autenticação)
- CORS configurado para localhost:4200
