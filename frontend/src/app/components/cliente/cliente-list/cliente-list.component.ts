import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-briefcase"></i> Clientes</h3>
            </header>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-8">
            <form (ngSubmit)="pesquisar()">
              <div class="input-group">
                <input type="text" class="form-control" [(ngModel)]="pesquisa" name="pesquisa" placeholder="Pesquisar por razão social, CNPJ ou telefone...">
                <button class="pesquisa cor" type="submit"><i class="bi bi-search"></i> Pesquisar</button>
              </div>
            </form>
          </div>
          <div class="col-md-4 text-end">
            <button class="btn btn-secondary me-2" data-bs-toggle="collapse" data-bs-target="#filtrosCliente">
              <i class="bi bi-funnel"></i> Filtros
            </button>
            <button class="btn btn-primary" (click)="router.navigate(['/clientes/novo'])"><i class="bi bi-plus-circle"></i> Novo Cliente</button>
          </div>
        </div>
        <div class="collapse mb-3" id="filtrosCliente">
          <div class="card card-body">
            <h6><i class="bi bi-funnel-fill"></i> Filtros Avançados</h6>
            <div class="row g-2">
              <div class="col-md-3">
                <label class="form-label small">Razão Social</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroRazao" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar razão...">
              </div>
              <div class="col-md-2">
                <label class="form-label small">CNPJ</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroCnpj" 
                       mask="00.000.000/0000-00" [showMaskTyped]="false" [dropSpecialCharacters]="false"
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar CNPJ...">
              </div>
              <div class="col-md-3">
                <label class="form-label small">Telefone</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroTelefone" 
                       mask="(00) 00000-0000" [showMaskTyped]="false" [dropSpecialCharacters]="false"
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar telefone...">
              </div>
              <div class="col-md-2">
                <label class="form-label small">CEP</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroCep" 
                       mask="00000-000" [showMaskTyped]="false" [dropSpecialCharacters]="false"
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar CEP...">
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
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.id" id="colIdCli">
                  <label class="form-check-label small" for="colIdCli">ID</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.razao" id="colRazaoCli">
                  <label class="form-check-label small" for="colRazaoCli">Razão Social</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.cnpj" id="colCnpjCli">
                  <label class="form-check-label small" for="colCnpjCli">CNPJ</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.telefone" id="colTelCli">
                  <label class="form-check-label small" for="colTelCli">Telefone</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.cep" id="colCepCli">
                  <label class="form-check-label small" for="colCepCli">CEP</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.acoes" id="colAcoesCli">
                  <label class="form-check-label small" for="colAcoesCli">Ações</label>
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
                <th class="azul" *ngIf="colunas.razao">Razão Social</th>
                <th class="azul" *ngIf="colunas.cnpj">CNPJ</th>
                <th class="azul" *ngIf="colunas.telefone">Telefone</th>
                <th class="azul" *ngIf="colunas.cep">CEP</th>
                <th class="azul text-center" *ngIf="colunas.acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of clientesFiltrados">
                <td *ngIf="colunas.id">{{ item.idCliente }}</td>
                <td *ngIf="colunas.razao">{{ item.razaosocialCliente }}</td>
                <td *ngIf="colunas.cnpj">{{ item.cnpjCliente }}</td>
                <td *ngIf="colunas.telefone">{{ item.telefoneCliente }}</td>
                <td *ngIf="colunas.cep">{{ item.cepCliente }}</td>
                <td class="text-center" *ngIf="colunas.acoes">
                  <button class="btn btn-sm btn-warning me-1" (click)="router.navigate(['/clientes/editar', item.idCliente])" title="Editar"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-sm btn-danger" (click)="deletar(item.idCliente!, item.razaosocialCliente)" title="Excluir"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="clientesFiltrados.length === 0">
                <td [attr.colspan]="contarColunas()" class="text-center"><i class="bi bi-inbox"></i> Nenhum cliente encontrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  pesquisa: string = '';
  loading = false;
  
  filtroRazao: string = '';
  filtroCnpj: string = '';
  filtroTelefone: string = '';
  filtroCep: string = '';
  
  colunas = {
    id: true,
    razao: true,
    cnpj: true,
    telefone: true,
    cep: true,
    acoes: true
  };
  
  constructor(public router: Router, private service: ClienteService) {}
  ngOnInit(): void { 
    this.loading = true;
    this.service.listarTodos().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  
  pesquisar(): void {
    this.aplicarFiltros();
  }
  
  aplicarFiltros(): void {
    this.clientesFiltrados = this.clientes.filter(c => {
      const matchRazao = !this.filtroRazao || c.razaosocialCliente.toLowerCase().includes(this.filtroRazao.toLowerCase());
      const matchCnpj = !this.filtroCnpj || c.cnpjCliente.includes(this.filtroCnpj);
      const matchTel = !this.filtroTelefone || c.telefoneCliente.includes(this.filtroTelefone);
      const matchCep = !this.filtroCep || c.cepCliente.includes(this.filtroCep);
      const matchPesquisa = !this.pesquisa || 
        c.razaosocialCliente.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        c.cnpjCliente.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        c.telefoneCliente.toLowerCase().includes(this.pesquisa.toLowerCase());
      return matchRazao && matchCnpj && matchTel && matchCep && matchPesquisa;
    });
  }

  limparFiltros(): void {
    this.filtroRazao = '';
    this.filtroCnpj = '';
    this.filtroTelefone = '';
    this.filtroCep = '';
    this.pesquisa = '';
    this.clientesFiltrados = this.clientes;
    this.colunas = { id: true, razao: true, cnpj: true, telefone: true, cep: true, acoes: true };
  }

  contarColunas(): number {
    return Object.values(this.colunas).filter(v => v).length;
  }
  
  deletar(id: number, nome: string): void {
    if (confirm(`Excluir ${nome}?`)) this.service.deletar(id).subscribe(() => this.ngOnInit());
  }
}
