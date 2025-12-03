# Comandos Rápidos - Sistema Rocha Transportes

## 🚀 INÍCIO RÁPIDO

### 1. Configurar Banco de Dados PostgreSQL

```powershell
# Conectar ao PostgreSQL
psql -U postgres

# Criar database
CREATE DATABASE db_rocha;

# Sair do psql
\q

# Executar script SQL
psql -U postgres -d db_rocha -f backend\db_rocha_postgres.sql
```

### 2. Iniciar Backend

```powershell
# Navegar para o backend
cd backend

# Executar com Maven wrapper
.\mvnw.cmd spring-boot:run

# OU usar o script PowerShell
.\start-backend.ps1
```

**Backend estará em**: http://localhost:8080

### 3. Iniciar Frontend (após npm install finalizar)

```powershell
# Navegar para o frontend
cd frontend

# Iniciar servidor de desenvolvimento
ng serve

# OU com npm
npm start
```

**Frontend estará em**: http://localhost:4200

---

## 🔍 TESTAR APIs DIRETAMENTE

### Login
```powershell
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"login\":\"admin\",\"senha\":\"123456\"}'
```

### Listar Motoristas (após obter token)
```powershell
curl http://localhost:8080/api/motoristas `
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🛠️ COMANDOS ÚTEIS

### Backend

```powershell
# Compilar sem executar
cd backend
.\mvnw.cmd clean package

# Executar testes
.\mvnw.cmd test

# Limpar target
.\mvnw.cmd clean
```

### Frontend

```powershell
cd frontend

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
ng serve

# Build para produção
ng build --configuration production

# Executar testes
ng test

# Verificar código
ng lint
```

### PostgreSQL

```powershell
# Ver databases
psql -U postgres -c "\l"

# Conectar ao db_rocha
psql -U postgres -d db_rocha

# Ver tabelas
\dt

# Ver dados de uma tabela
SELECT * FROM tbusuario;

# Sair
\q
```

---

## 📊 VERIFICAR STATUS

### Backend Funcionando?
```powershell
curl http://localhost:8080/api/auth/login
# Deve retornar erro 400 (esperado sem credenciais)
```

### Frontend Funcionando?
Abrir navegador em: http://localhost:4200

### Banco de Dados OK?
```powershell
psql -U postgres -d db_rocha -c "SELECT COUNT(*) FROM tbusuario;"
# Deve retornar 1 (usuário admin)
```

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Backend não inicia

```powershell
# Verificar Java
java -version
# Deve ser Java 17 ou superior

# Verificar PostgreSQL
psql -U postgres -c "SELECT version();"

# Ver logs detalhados
cd backend
.\mvnw.cmd spring-boot:run -X
```

### Frontend não inicia

```powershell
# Verificar Node
node -v
# Deve ser 18 ou superior

# Verificar Angular CLI
ng version

# Reinstalar dependências
cd frontend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Erro de CORS

Verificar em `backend/src/main/resources/application.properties`:
```properties
cors.allowed.origins=http://localhost:4200
```

### Erro de conexão com banco

Verificar em `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/db_rocha
spring.datasource.username=postgres
spring.datasource.password=root
```

Ajustar usuário e senha conforme sua instalação do PostgreSQL.

---

## 📦 PRIMEIRO ACESSO

1. Acesse: http://localhost:4200
2. Faça login com:
   - **Usuário**: admin
   - **Senha**: 123456
3. Explore o dashboard
4. Teste os cadastros

---

## 🔄 REINICIAR TUDO

```powershell
# Parar backend (Ctrl+C no terminal)
# Parar frontend (Ctrl+C no terminal)

# Reiniciar PostgreSQL (se necessário)
# Windows: Services > PostgreSQL > Restart

# Iniciar backend
cd backend
.\mvnw.cmd spring-boot:run

# Iniciar frontend (novo terminal)
cd frontend
ng serve
```

---

## 📝 CRIAR NOVOS MÓDULOS

Para adicionar novos CRUDs, siga o `GUIA_CRUD.md` na pasta frontend.

Padrão:
1. Criar Model em `models/`
2. Criar Service em `services/`
3. Criar componentes list e form em `components/`
4. Adicionar rotas em `app-routing.module.ts`
5. Declarar componentes em `app.module.ts`
6. Adicionar item no navbar

---

## 🎯 ENDPOINTS PRINCIPAIS

### Autenticação
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Registrar
- GET `/api/auth/me` - Usuário logado

### Motoristas
- GET `/api/motoristas` - Listar
- GET `/api/motoristas/{id}` - Buscar
- POST `/api/motoristas` - Criar
- PUT `/api/motoristas/{id}` - Atualizar
- DELETE `/api/motoristas/{id}` - Deletar

*(Mesmo padrão para: agregados, ajudantes, clientes, transportes, notas, rotas)*

---

## 💾 BACKUP DO BANCO

```powershell
# Fazer backup
pg_dump -U postgres -d db_rocha -f backup_rocha.sql

# Restaurar backup
psql -U postgres -d db_rocha -f backup_rocha.sql
```

---

## 📚 ESTRUTURA DE PASTAS

```
SistemaRocha/
├── backend/          ← Backend Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── mvnw.cmd
├── frontend/         ← Frontend Angular
│   ├── src/
│   ├── package.json
│   └── angular.json
├── dbrocha/          ← Sistema antigo (referência)
├── README.md
├── RESUMO_IMPLEMENTACAO.md
└── COMANDOS_RAPIDOS.md (este arquivo)
```

---

## ✅ CHECKLIST DE INICIALIZAÇÃO

- [ ] PostgreSQL instalado e rodando
- [ ] Database `db_rocha` criada
- [ ] Script SQL executado
- [ ] Java 17+ instalado
- [ ] Node.js 18+ instalado
- [ ] Angular CLI instalado (`npm install -g @angular/cli`)
- [ ] Backend iniciado (porta 8080)
- [ ] Frontend dependencies instaladas
- [ ] Frontend iniciado (porta 4200)
- [ ] Login com admin/123456 funcionando

## 🆕 TESTAR SISTEMA DE CADASTRO E RECUPERAÇÃO

### 1. Aplicar Migração do CPF (se banco já existe)

```powershell
# No PostgreSQL
psql -U postgres -d db_rocha -f backend\migration_add_cpf.sql
```

### 2. Testar Cadastro de Novo Usuário

**Acesse:** http://localhost:4200/cadastro

**Dados de teste:**
```
Nome Completo: Maria Santos
CPF: 111.222.333-44
Senha: Teste@2024
Confirmar Senha: Teste@2024
```

**Validações testadas:**
- Nome mínimo 3 caracteres ✅
- CPF com máscara automática ✅
- Senha forte (maiúscula + número + especial) ✅
- Senhas conferem ✅

### 3. Fazer Login com CPF

**Acesse:** http://localhost:4200/login

**Credenciais:**
```
Usuário: 11122233344 (CPF sem formatação)
Senha: Teste@2024
```

### 4. Testar Recuperação de Senha

**Acesse:** http://localhost:4200/recuperar-senha

**Digite CPF cadastrado:**
```
CPF: 111.222.333-44
```

**Resultado esperado:**
- Mensagem com senha temporária exibida ✅
- Redirecionamento automático em 3s ✅
- Login funciona com nova senha ✅

### 5. Testar Validações de Erro

**CPF já cadastrado:**
```powershell
# Tente cadastrar o mesmo CPF novamente
# Deve exibir: "CPF já cadastrado no sistema"
```

**Senha fraca:**
```
Senha: 12345678 (sem maiúsculas/especiais)
# Deve exibir erro de senha fraca
```

**Senhas não conferem:**
```
Senha: Teste@2024
Confirmar: Teste@2025
# Deve exibir: "As senhas não conferem"
```

**CPF não existe (recuperação):**
```
CPF: 999.999.999-99
# Deve exibir: "CPF não encontrado no sistema"
```

### 6. Verificar Backend (Endpoints)

**Testar cadastro via curl:**
```powershell
curl -X POST http://localhost:8080/api/usuarios/cadastro `
  -H "Content-Type: application/json" `
  -d '{
    "nomeCompleto": "João Silva",
    "cpf": "222.333.444-55",
    "senha": "Senha@123",
    "confirmarSenha": "Senha@123"
  }'
```

**Testar recuperação via curl:**
```powershell
curl -X POST http://localhost:8080/api/usuarios/recuperar-senha `
  -H "Content-Type: application/json" `
  -d '{
    "cpf": "222.333.444-55"
  }'
```

### 7. Verificar Banco de Dados

```sql
-- Conectar ao PostgreSQL
psql -U postgres -d db_rocha

-- Ver usuários cadastrados
SELECT loginUser, nomeUser, cpfUser, criadoEm FROM tbusuario;

-- Ver estrutura da tabela
\d tbusuario

-- Sair
\q
```

---

**Dica**: Mantenha 2 terminais abertos - um para backend e outro para frontend!

**Documentação completa**: Ver `GUIA_CADASTRO_RECUPERACAO.md`
