# Sistema Rocha Transportes - Instruções de Setup

## Backend (Java Spring Boot)

### Pré-requisitos
- Java 17 ou superior
- PostgreSQL 12 ou superior
- Maven 3.6 ou superior

### Configuração do Banco de Dados

1. Instale o PostgreSQL se ainda não tiver
2. Crie o banco de dados:
```sql
CREATE DATABASE db_rocha;
```

3. Execute o script SQL fornecido:
```bash
psql -U postgres -d db_rocha -f backend/db_rocha_postgres.sql
```

4. Configure as credenciais em `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

### Executando o Backend

```bash
cd backend
./mvnw spring-boot:run
```

Ou no Windows:
```bash
cd backend
mvnw.cmd spring-boot:run
```

O backend estará disponível em: http://localhost:8080

### Usuário Padrão
- Login: `admin`
- Senha: `123456`

## Frontend (Angular)

### Pré-requisitos
- Node.js 18 ou superior
- Angular CLI 17 ou superior

### Instalação

```bash
cd frontend
npm install
```

### Executando o Frontend

```bash
cd frontend
ng serve
```

O frontend estará disponível em: http://localhost:4200

## APIs Disponíveis

### Autenticação
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Registro
- GET `/api/auth/me` - Dados do usuário logado
- PUT `/api/auth/me` - Atualizar perfil

### Motoristas
- GET `/api/motoristas` - Listar todos
- GET `/api/motoristas/{id}` - Buscar por ID
- POST `/api/motoristas` - Criar novo
- PUT `/api/motoristas/{id}` - Atualizar
- DELETE `/api/motoristas/{id}` - Deletar

### Agregados
- GET `/api/agregados` - Listar todos
- GET `/api/agregados/{id}` - Buscar por ID
- POST `/api/agregados` - Criar novo
- PUT `/api/agregados/{id}` - Atualizar
- DELETE `/api/agregados/{id}` - Deletar

### Ajudantes
- GET `/api/ajudantes` - Listar todos
- GET `/api/ajudantes/{id}` - Buscar por ID
- POST `/api/ajudantes` - Criar novo
- PUT `/api/ajudantes/{id}` - Atualizar
- DELETE `/api/ajudantes/{id}` - Deletar

### Clientes
- GET `/api/clientes` - Listar todos
- GET `/api/clientes/{id}` - Buscar por ID
- POST `/api/clientes` - Criar novo
- PUT `/api/clientes/{id}` - Atualizar
- DELETE `/api/clientes/{id}` - Deletar

### Transportes
- GET `/api/transportes` - Listar todos
- GET `/api/transportes/{id}` - Buscar por ID
- POST `/api/transportes` - Criar novo
- PUT `/api/transportes/{id}` - Atualizar
- DELETE `/api/transportes/{id}` - Deletar

### Notas Fiscais
- GET `/api/notas` - Listar todas
- GET `/api/notas/{id}` - Buscar por ID
- POST `/api/notas` - Criar nova
- PUT `/api/notas/{id}` - Atualizar
- DELETE `/api/notas/{id}` - Deletar

### Rotas
- GET `/api/rotas` - Listar todas
- GET `/api/rotas/{id}` - Buscar por ID
- POST `/api/rotas` - Criar nova
- PUT `/api/rotas/{id}` - Atualizar
- DELETE `/api/rotas/{id}` - Deletar

## Estrutura do Projeto

```
SistemaRocha/
├── backend/                    # Backend Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/rochatransportes/
│   │       │       ├── config/         # Configurações
│   │       │       ├── controller/     # Controllers REST
│   │       │       ├── dto/            # Data Transfer Objects
│   │       │       ├── model/          # Entidades JPA
│   │       │       ├── repository/     # Repositories
│   │       │       ├── security/       # Segurança e JWT
│   │       │       └── service/        # Serviços
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── db_rocha_postgres.sql   # Script do banco
├── frontend/                   # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Componentes
│   │   │   ├── services/       # Serviços
│   │   │   ├── guards/         # Guards de autenticação
│   │   │   ├── interceptors/   # Interceptadores HTTP
│   │   │   └── models/         # Interfaces/Models
│   │   ├── assets/             # Recursos estáticos
│   │   └── styles.css          # Estilos globais
│   ├── angular.json
│   └── package.json
└── dbrocha/                    # Sistema PHP antigo (referência)
```

## Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.1.4
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- Angular 17
- TypeScript
- Bootstrap 5
- RxJS
- Angular Material (opcional)

## Segurança
- Autenticação via JWT (JSON Web Token)
- Senhas criptografadas com BCrypt
- CORS configurado para localhost:4200
- Proteção de rotas no frontend com Guards
- Validação de dados no backend com Bean Validation

## Próximos Passos
1. Execute o script SQL no PostgreSQL
2. Inicie o backend
3. Instale as dependências do frontend
4. Inicie o frontend
5. Acesse http://localhost:4200 e faça login com admin/123456
