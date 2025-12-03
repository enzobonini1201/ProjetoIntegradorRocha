# Sistema Rocha - Frontend Angular

## 🎨 Design Atualizado

O frontend Angular foi atualizado para corresponder exatamente ao design do projeto `dbrocha`, mantendo a mesma identidade visual e experiência do usuário.

## ✨ Mudanças Implementadas

### 1. **Tela de Login**
- ✅ Layout dividido em dois painéis (esquerdo com logo, direito com formulário)
- ✅ Gradiente azul no lado esquerdo (#e3f2fd → #bbdefb)
- ✅ Logo da Rocha centralizada com efeito de hover
- ✅ Animações suaves de entrada (fadeIn, fadeInUp)
- ✅ Botão de mostrar/ocultar senha funcional
- ✅ Validação de formulário com mensagens de erro
- ✅ Design responsivo para mobile

### 2. **Navbar (Header)**
- ✅ Logo da Rocha no canto esquerdo (90x90px)
- ✅ Menus dropdown azuis (#0099ff) para cada módulo
- ✅ Opções "CADASTRAR" e "CONSULTAR" em cada menu
- ✅ Ícone de perfil no canto direito
- ✅ Fundo branco com sombra azul (#00c3ff76)
- ✅ Design sticky no topo da página
- ✅ Bordas arredondadas (9px)

### 3. **Cores Globais**
- ✅ Fundo da página: `#dfdfdf` (cinza claro)
- ✅ Cards/Bordas: branco com `box-shadow: 0 0 10px rgba(0, 0, 0, 0.4)`
- ✅ Botões principais: `#0099ff` (azul)
- ✅ Hover dos botões: `#00c3ff` (azul claro)

### 4. **Tipografia**
- ✅ Labels: `font-weight: bold` + `font-family: Arial, Helvetica, sans-serif`
- ✅ Títulos h3: `font-weight: bold`
- ✅ Fonte padrão: Segoe UI, Tahoma, Geneva, Verdana, sans-serif

### 5. **Componentes**
- ✅ Classe `.borda` para containers com fundo branco e sombra
- ✅ Classe `.cadastrar` para botões de cadastro
- ✅ Dropdowns com bordas arredondadas e animação hover
- ✅ Cards com sombras mais pronunciadas

## 🚀 Como Executar

```powershell
cd frontend
npm install
npm start
```

O servidor estará disponível em: **http://localhost:4200/**

## 📁 Estrutura de Arquivos Modificados

```
frontend/src/
├── app/
│   └── components/
│       ├── login/
│       │   ├── login.component.html   ✅ Atualizado
│       │   ├── login.component.css    ✅ Atualizado
│       │   └── login.component.ts     ✅ Atualizado (função togglePassword)
│       ├── navbar/
│       │   ├── navbar.component.html  ✅ Atualizado
│       │   └── navbar.component.css   ✅ Atualizado
│       └── home/
│           └── home.component.css     ✅ Atualizado
├── assets/
│   └── Logo rocha.png                 ✅ Adicionado
└── styles.css                         ✅ Atualizado (estilos globais)
```

## 🎯 Funcionalidades

### Login
- Validação de campos obrigatórios
- Mensagens de erro personalizadas
- Botão de mostrar/ocultar senha
- Animação shake em erros
- Link para recuperar senha
- Link para cadastro de novo usuário

### Navbar
- Menu dropdown para cada módulo:
  - 🚗 MOTORISTAS
  - 👥 AGREGADOS
  - 🤝 AJUDANTES
  - 🚚 TRANSPORTES
  - 💼 CLIENTES
  - 📄 NOTAS
  - 🗺️ ROTAS
- Menu de perfil com opções PERFIL e SAIR

## 🎨 Paleta de Cores

| Elemento | Cor | Hex |
|----------|-----|-----|
| Fundo Principal | Cinza Claro | `#dfdfdf` |
| Botões Primários | Azul | `#0099ff` |
| Botões Hover | Azul Claro | `#00c3ff` |
| Cards/Containers | Branco | `#ffffff` |
| Login - Gradiente 1 | Azul Claro | `#e3f2fd` |
| Login - Gradiente 2 | Azul | `#bbdefb` |
| Login - Botão | Azul | `#0088dd` |

## 📱 Responsividade

O design é totalmente responsivo e se adapta a:
- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 992px)
- 💻 Desktop (> 992px)

## 🔧 Tecnologias

- Angular 17
- Bootstrap 5.3.2
- Bootstrap Icons 1.11.1
- TypeScript 5.2.2
- RxJS 7.8.0

---

**Status**: ✅ Angular funcionando perfeitamente com o design do dbrocha!
