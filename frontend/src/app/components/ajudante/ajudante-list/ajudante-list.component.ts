import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AjudanteService } from '../../../services/ajudante.service';
import { Ajudante } from '../../../models/ajudante.model';

@Component({
  selector: 'app-ajudante-list',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-people"></i> Ajudantes</h3>
            </header>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-8">
            <form (ngSubmit)="pesquisar()">
              <div class="input-group">
                <input type="text" class="form-control" [(ngModel)]="pesquisa" name="pesquisa" placeholder="Pesquisar por nome, telefone ou CPF...">
                <button class="pesquisa cor" type="submit"><i class="bi bi-search"></i> Pesquisar</button>
              </div>
            </form>
          </div>
          <div class="col-md-4 text-end">
            <button class="btn btn-secondary me-2" data-bs-toggle="collapse" data-bs-target="#filtrosAjudante">
              <i class="bi bi-funnel"></i> Filtros
            </button>
            <button class="btn btn-primary" (click)="router.navigate(['/ajudantes/novo'])">
              <i class="bi bi-plus-circle"></i> Novo Ajudante
            </button>
          </div>
        </div>
        <div class="collapse mb-3" id="filtrosAjudante">
          <div class="card card-body">
            <h6><i class="bi bi-funnel-fill"></i> Filtros Avançados</h6>
            <div class="row g-2">
              <div class="col-md-4">
                <label class="form-label small">Nome</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroNome" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar nome...">
              </div>
              <div class="col-md-3">
                <label class="form-label small">Telefone</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroTelefone" 
                       mask="(00) 00000-0000" [showMaskTyped]="false" [dropSpecialCharacters]="false"
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar telefone...">
              </div>
              <div class="col-md-2">
                <label class="form-label small">CPF</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroCpf" 
                       mask="000.000.000-00" [showMaskTyped]="false" [dropSpecialCharacters]="false"
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar CPF...">
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <button class="btn btn-sm btn-outline-danger w-100" (click)="limparFiltros()" title="Limpar filtros">
                  <i class="bi bi-x-circle"></i>
                </button>
              </div>
            </div>
            <hr class="my-2">
            <div class="row">
              <div class="col-12">
                <label class="form-label small"><i class="bi bi-eye"></i> Colunas Visíveis:</label>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.id" id="colIdAjud">
                  <label class="form-check-label small" for="colIdAjud">ID</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.nome" id="colNomeAjud">
                  <label class="form-check-label small" for="colNomeAjud">Nome</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.telefone" id="colTelAjud">
                  <label class="form-check-label small" for="colTelAjud">Telefone</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.cpf" id="colCpfAjud">
                  <label class="form-check-label small" for="colCpfAjud">CPF</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.dataNasc" id="colDataAjud">
                  <label class="form-check-label small" for="colDataAjud">Data Nasc.</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.endereco" id="colEndAjud">
                  <label class="form-check-label small" for="colEndAjud">Endereço</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.acoes" id="colAcoesAjud">
                  <label class="form-check-label small" for="colAcoesAjud">Ações</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div *ngIf="loading" class="spinner-container">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div>
        </div>
        <div class="tabela borda" *ngIf="!loading">
          <table class="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th class="azul" *ngIf="colunas.id">ID</th>
                <th class="azul" *ngIf="colunas.nome">Nome</th>
                <th class="azul" *ngIf="colunas.telefone">Telefone</th>
                <th class="azul" *ngIf="colunas.cpf">CPF</th>
                <th class="azul" *ngIf="colunas.dataNasc">Data Nascimento</th>
                <th class="azul" *ngIf="colunas.endereco">Endereço</th>
                <th class="azul text-center" *ngIf="colunas.acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of ajudantesFiltrados">
                <td *ngIf="colunas.id">{{ item.idAjuda }}</td>
                <td *ngIf="colunas.nome">{{ item.nomeAjuda }}</td>
                <td *ngIf="colunas.telefone">{{ item.telefoneAjuda }}</td>
                <td *ngIf="colunas.cpf">{{ item.cpfAjuda }}</td>
                <td *ngIf="colunas.dataNasc">{{ item.datanascAjuda | date: 'dd/MM/yyyy' }}</td>
                <td *ngIf="colunas.endereco">{{ item.enderecoAjuda }}</td>
                <td class="text-center" *ngIf="colunas.acoes">
                  <button class="btn btn-sm btn-warning me-1" (click)="router.navigate(['/ajudantes/editar', item.idAjuda])" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" (click)="deletar(item.idAjuda!, item.nomeAjuda)" title="Excluir">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="ajudantesFiltrados.length === 0">
                <td [attr.colspan]="contarColunas()" class="text-center"><i class="bi bi-inbox"></i> Nenhum ajudante encontrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AjudanteListComponent implements OnInit {
  ajudantes: Ajudante[] = [];
  ajudantesFiltrados: Ajudante[] = [];
  pesquisa: string = '';
  loading = false;
  
  filtroNome: string = '';
  filtroTelefone: string = '';
  filtroCpf: string = '';
  
  colunas = {
    id: true,
    nome: true,
    telefone: true,
    cpf: true,
    dataNasc: true,
    endereco: true,
    acoes: true
  };
  
  constructor(public router: Router, private service: AjudanteService) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.service.listarTodos().subscribe({
      next: (data) => {
        this.ajudantes = data;
        this.ajudantesFiltrados = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  
  pesquisar(): void {
    this.aplicarFiltros();
  }
  
  aplicarFiltros(): void {
    this.ajudantesFiltrados = this.ajudantes.filter(a => {
      const matchNome = !this.filtroNome || a.nomeAjuda.toLowerCase().includes(this.filtroNome.toLowerCase());
      const matchTelefone = !this.filtroTelefone || a.telefoneAjuda.includes(this.filtroTelefone);
      const matchCpf = !this.filtroCpf || a.cpfAjuda.includes(this.filtroCpf);
      const matchPesquisa = !this.pesquisa || 
        a.nomeAjuda.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        a.telefoneAjuda.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        a.cpfAjuda.toLowerCase().includes(this.pesquisa.toLowerCase());
      return matchNome && matchTelefone && matchCpf && matchPesquisa;
    });
  }

  limparFiltros(): void {
    this.filtroNome = '';
    this.filtroTelefone = '';
    this.filtroCpf = '';
    this.pesquisa = '';
    this.ajudantesFiltrados = this.ajudantes;
    this.colunas = { id: true, nome: true, telefone: true, cpf: true, dataNasc: true, endereco: true, acoes: true };
  }

  contarColunas(): number {
    return Object.values(this.colunas).filter(v => v).length;
  }
  
  deletar(id: number, nome: string): void {
    if (confirm(`Excluir ${nome}?`)) {
      this.service.deletar(id).subscribe(() => this.ngOnInit());
    }
  }
}
