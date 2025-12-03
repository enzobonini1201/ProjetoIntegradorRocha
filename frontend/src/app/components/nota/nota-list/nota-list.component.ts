import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotaService } from '../../../services/nota.service';
import { Nota } from '../../../models/nota.model';

@Component({
  selector: 'app-nota-list',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-card-checklist"></i> Notas Fiscais</h3>
            </header>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-8">
            <form (ngSubmit)="pesquisar()">
              <div class="input-group">
                <input type="text" class="form-control" [(ngModel)]="pesquisa" name="pesquisa" placeholder="Pesquisar por número, cliente, razão social ou cidade...">
                <button class="pesquisa cor" type="submit"><i class="bi bi-search"></i> Pesquisar</button>
              </div>
            </form>
          </div>
          <div class="col-md-4 text-end">
            <button class="btn btn-secondary me-2" data-bs-toggle="collapse" data-bs-target="#filtrosNotas">
              <i class="bi bi-funnel"></i> Filtros
            </button>
            <button class="btn btn-primary" (click)="router.navigate(['/notas/novo'])"><i class="bi bi-plus-circle"></i> Nova Nota Fiscal</button>
          </div>
        </div>
        <div class="collapse mb-3" id="filtrosNotas">
          <div class="card card-body">
            <h6><i class="bi bi-funnel-fill"></i> Filtros Avançados</h6>
            <div class="row g-2">
              <div class="col-md-2">
                <label class="form-label small">Número</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroNumero" 
                       mask="separator.0" thousandSeparator="" [showMaskTyped]="false" [dropSpecialCharacters]="false"
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar número...">
              </div>
              <div class="col-md-3">
                <label class="form-label small">Cliente</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroCliente" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar cliente...">
              </div>
              <div class="col-md-3">
                <label class="form-label small">Razão Social Dest.</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroRazao" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar razão...">
              </div>
              <div class="col-md-2">
                <label class="form-label small">Cidade</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroCidade" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar cidade...">
              </div>
              <div class="col-md-1">
                <label class="form-label small">Status</label>
                <select class="form-select form-select-sm" [(ngModel)]="filtroStatus" (ngModelChange)="aplicarFiltros()">
                  <option value="">Todos</option>
                  <option value="entregue">Entregue</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
              <div class="col-md-1 d-flex align-items-end">
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
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.id" id="colIdNota">
                  <label class="form-check-label small" for="colIdNota">ID</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.numero" id="colNumNota">
                  <label class="form-check-label small" for="colNumNota">Número</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.quantidade" id="colQtdNota">
                  <label class="form-check-label small" for="colQtdNota">Quantidade</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.cliente" id="colCliNota">
                  <label class="form-check-label small" for="colCliNota">Cliente</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.razao" id="colRazNota">
                  <label class="form-check-label small" for="colRazNota">Razão Social</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.cidade" id="colCidNota">
                  <label class="form-check-label small" for="colCidNota">Cidade</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.dataColeta" id="colDCNota">
                  <label class="form-check-label small" for="colDCNota">Data Coleta</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.dataEntrega" id="colDENota">
                  <label class="form-check-label small" for="colDENota">Data Entrega</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.status" id="colStNota">
                  <label class="form-check-label small" for="colStNota">Status</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.acoes" id="colAcNota">
                  <label class="form-check-label small" for="colAcNota">Ações</label>
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
                <th class="azul" *ngIf="colunas.numero">Número</th>
                <th class="azul" *ngIf="colunas.quantidade">Qtd</th>
                <th class="azul" *ngIf="colunas.cliente">Cliente</th>
                <th class="azul" *ngIf="colunas.razao">Razão Social Dest.</th>
                <th class="azul" *ngIf="colunas.cidade">Cidade Dest.</th>
                <th class="azul" *ngIf="colunas.dataColeta">Data Coleta</th>
                <th class="azul" *ngIf="colunas.dataEntrega">Data Entrega</th>
                <th class="azul text-center" *ngIf="colunas.status">Status</th>
                <th class="azul text-center" *ngIf="colunas.acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of notasFiltradas">
                <td *ngIf="colunas.id">{{ item.idNota }}</td>
                <td *ngIf="colunas.numero">{{ item.numeroNota }}</td>
                <td *ngIf="colunas.quantidade">{{ item.qtdNota }}</td>
                <td *ngIf="colunas.cliente">{{ item.clienteNota }}</td>
                <td *ngIf="colunas.razao">{{ item.razaosocialdestNota }}</td>
                <td *ngIf="colunas.cidade">{{ item.cidadedestNota }}</td>
                <td *ngIf="colunas.dataColeta">{{ item.datacoletaNota | date: 'dd/MM/yyyy' }}</td>
                <td *ngIf="colunas.dataEntrega">{{ item.dataentregaNota ? (item.dataentregaNota | date: 'dd/MM/yyyy') : '-' }}</td>
                <td class="text-center" *ngIf="colunas.status">
                  <span *ngIf="item.dataentregaNota" class="badge bg-success">
                    <i class="bi bi-check-circle"></i> Entregue
                  </span>
                  <span *ngIf="!item.dataentregaNota" class="badge bg-warning text-dark">
                    <i class="bi bi-hourglass-split"></i> Pendente
                  </span>
                </td>
                <td class="text-center" *ngIf="colunas.acoes">
                  <button class="btn btn-sm btn-warning me-1" (click)="router.navigate(['/notas/editar', item.idNota])" title="Editar"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-sm btn-danger" (click)="deletar(item.idNota!, item.numeroNota)" title="Excluir"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="notasFiltradas.length === 0">
                <td [attr.colspan]="contarColunas()" class="text-center"><i class="bi bi-inbox"></i> Nenhuma nota fiscal encontrada</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class NotaListComponent implements OnInit {
  notas: Nota[] = [];
  notasFiltradas: Nota[] = [];
  pesquisa: string = '';
  loading = false;
  
  // Filtros
  filtroNumero: string = '';
  filtroCliente: string = '';
  filtroRazao: string = '';
  filtroCidade: string = '';
  filtroStatus: string = '';
  
  colunas = {
    id: true,
    numero: true,
    quantidade: true,
    cliente: true,
    razao: true,
    cidade: true,
    dataColeta: true,
    dataEntrega: true,
    status: true,
    acoes: true
  };
  
  constructor(public router: Router, private service: NotaService) {}
  ngOnInit(): void { 
    this.loading = true;
    this.service.listarTodas().subscribe({
      next: (data) => {
        this.notas = data;
        this.notasFiltradas = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  
  pesquisar(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.notasFiltradas = this.notas.filter(nota => {
      const matchNumero = !this.filtroNumero || 
        nota.numeroNota?.toString().includes(this.filtroNumero);
      const matchCliente = !this.filtroCliente || 
        nota.clienteNota?.toLowerCase().includes(this.filtroCliente.toLowerCase());
      const matchRazao = !this.filtroRazao || 
        nota.razaosocialdestNota?.toLowerCase().includes(this.filtroRazao.toLowerCase());
      const matchCidade = !this.filtroCidade || 
        nota.cidadedestNota?.toLowerCase().includes(this.filtroCidade.toLowerCase());
      const matchStatus = !this.filtroStatus || 
        (this.filtroStatus === 'entregue' && nota.dataentregaNota) ||
        (this.filtroStatus === 'pendente' && !nota.dataentregaNota);
      const matchPesquisa = !this.pesquisa || 
        nota.numeroNota?.toString().includes(this.pesquisa.toLowerCase()) ||
        nota.clienteNota?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        nota.razaosocialdestNota?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        nota.cidadedestNota?.toLowerCase().includes(this.pesquisa.toLowerCase());
      
      return matchNumero && matchCliente && matchRazao && matchCidade && matchStatus && matchPesquisa;
    });
  }

  limparFiltros(): void {
    this.filtroNumero = '';
    this.filtroCliente = '';
    this.filtroRazao = '';
    this.filtroCidade = '';
    this.filtroStatus = '';
    this.pesquisa = '';
    this.aplicarFiltros();
  }

  contarColunas(): number {
    return Object.values(this.colunas).filter(v => v).length;
  }

  deletar(id: number, numero: number): void {
    if (confirm(`Excluir nota ${numero}?`)) this.service.deletar(id).subscribe(() => this.ngOnInit());
  }
}
