# Guia de Criação de Componentes CRUD

Este guia explica como criar os componentes restantes seguindo o padrão do Motorista.

## Estrutura de cada CRUD

Cada módulo deve ter:
1. **list.component** - Listagem com pesquisa e exclusão
2. **form.component** - Formulário de cadastro/edição

## Componentes List

### Template Base (list.component.ts)
```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { [Nome]Service } from '../../../services/[nome].service';
import { [Nome] } from '../../../models/[nome].model';

@Component({
  selector: 'app-[nome]-list',
  templateUrl: './[nome]-list.component.html',
  styleUrls: ['./[nome]-list.component.css']
})
export class [Nome]ListComponent implements OnInit {
  [nomes]: [Nome][] = [];
  loading: boolean = true;
  pesquisa: string = '';
  error: string = '';

  constructor(
    private [nome]Service: [Nome]Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar[Nomes]();
  }

  carregar[Nomes](): void {
    this.loading = true;
    this.[nome]Service.listarTodos(this.pesquisa)
      .subscribe({
        next: (data) => {
          this.[nomes] = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro:', error);
          this.error = 'Erro ao carregar';
          this.loading = false;
        }
      });
  }

  pesquisar(): void {
    this.carregar[Nomes]();
  }

  novo(): void {
    this.router.navigate(['/[nomes]/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/[nomes]/editar', id]);
  }

  deletar(id: number, nome: string): void {
    if (confirm(`Deseja realmente excluir ${nome}?`)) {
      this.[nome]Service.deletar(id)
        .subscribe({
          next: () => {
            alert('Excluído com sucesso!');
            this.carregar[Nomes]();
          },
          error: (error) => {
            console.error('Erro:', error);
            alert('Erro ao deletar');
          }
        });
    }
  }
}
```

### Template HTML Base (list.component.html)
Ver motorista-list.component.html como referência e substituir:
- Título e ícone
- Campos da tabela conforme o modelo
- Nome das propriedades do objeto

## Componentes Form

### Template Base (form.component.ts)
Ver motorista-form.component.ts como referência e:
1. Alterar imports e nomes
2. Ajustar campos do FormGroup conforme modelo
3. Manter mesma lógica de edição/criação

### Template HTML Base (form.component.html)
Ver motorista-form.component.html como referência e:
1. Alterar título
2. Adicionar campos conforme modelo
3. Manter validações e botões

## Mapeamento de Componentes Faltantes

### 1. Agregado (já tem model e service)
- agregado-list.component
- agregado-form.component
Campos: nomeAgre, telefoneAgre, datanascAgre, cpfAgre, cepAgre, buonnyAgre, cnhAgre

### 2. Ajudante (já tem model e service)
- ajudante-list.component
- ajudante-form.component
Campos: nomeAjuda, telefoneAjuda, datanascAjuda, cpfAjuda, cepAjuda

### 3. Cliente (já tem model e service)
- cliente-list.component
- cliente-form.component
Campos: telefoneCliente, razaosocialCliente, cnpjCliente, cepCliente

### 4. Transporte (já tem model e service)
- transporte-list.component
- transporte-form.component
Campos: tipoTrans, placaTrans, capacidadeTrans, nomeTrans, responsavelTrans

### 5. Nota (já tem model e service)
- nota-list.component
- nota-form.component
Campos: numeroNota, qtdNota, razaosocialdestNota, cidadedestNota, cnpjdestNota, 
        coletadoporNota, entregueporNota, datacoletaNota, dataentregaNota, clienteNota

### 6. Rota (já tem model, service e backend completo)
- rota-list.component
- rota-form.component
Campos: nomeRota, origem, destino, distanciaKm, tempoEstimadoHoras, pedagios, observacoes

## Passos para Criar Cada CRUD

1. Copiar motorista-list.component.ts
2. Renomear todas as ocorrências de "Motorista" para o nome do módulo
3. Ajustar os campos da tabela HTML
4. Copiar motorista-form.component.ts
5. Ajustar FormGroup com os campos corretos
6. Ajustar o template HTML com os campos
7. Adicionar no app.module.ts (já está declarado)
8. Testar no navegador

## Ícones Bootstrap para cada módulo

- Motorista: bi-person-badge
- Agregado: bi-person-check
- Ajudante: bi-people
- Cliente: bi-briefcase
- Transporte: bi-truck-front
- Nota: bi-card-checklist
- Rota: bi-map

## Cores para Cards Dashboard

Sugestões de gradientes:
- Motorista: #667eea → #764ba2
- Agregado: #f093fb → #f5576c
- Ajudante: #4facfe → #00f2fe
- Cliente: #43e97b → #38f9d7
- Transporte: #fa709a → #fee140
- Nota: #30cfd0 → #330867
- Rota: #a8edea → #fed6e3
