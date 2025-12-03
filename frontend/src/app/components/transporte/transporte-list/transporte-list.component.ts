import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransporteService } from '../../../services/transporte.service';
import { Transporte } from '../../../models/transporte.model';

@Component({
  selector: 'app-transporte-list',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-truck-front"></i> Transportes</h3>
            </header>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-8">
            <form (ngSubmit)="pesquisar()">
              <div class="input-group">
                <input type="text" class="form-control" [(ngModel)]="pesquisa" name="pesquisa" placeholder="Pesquisar por tipo, placa, nome ou responsável...">
                <button class="pesquisa cor" type="submit"><i class="bi bi-search"></i> Pesquisar</button>
              </div>
            </form>
          </div>
          <div class="col-md-4 text-end">
            <button class="btn btn-secondary me-2" data-bs-toggle="collapse" data-bs-target="#filtrosTransporte">
              <i class="bi bi-funnel"></i> Filtros
            </button>
            <button class="btn btn-primary" (click)="router.navigate(['/transportes/novo'])"><i class="bi bi-plus-circle"></i> Novo Transporte</button>
          </div>
        </div>
        <div class="collapse mb-3" id="filtrosTransporte">
          <div class="card card-body">
            <h6><i class="bi bi-funnel-fill"></i> Filtros Avançados</h6>
            <div class="row g-2">
              <div class="col-md-2">
                <label class="form-label small">Tipo</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroTipo" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar tipo...">
              </div>
              <div class="col-md-3">
                <label class="form-label small">Placa</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroPlaca" 
                       mask="SSS-0*00" [showMaskTyped]="false" [dropSpecialCharacters]="false"
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar placa...">
              </div>
              <div class="col-md-3">
                <label class="form-label small">Nome</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroNome" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar nome...">
              </div>
              <div class="col-md-3">
                <label class="form-label small">Responsável</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroResponsavel" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar responsável...">
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
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.id" id="colIdTrans">
                  <label class="form-check-label small" for="colIdTrans">ID</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.tipo" id="colTipoTrans">
                  <label class="form-check-label small" for="colTipoTrans">Tipo</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.placa" id="colPlacaTrans">
                  <label class="form-check-label small" for="colPlacaTrans">Placa</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.nome" id="colNomeTrans">
                  <label class="form-check-label small" for="colNomeTrans">Modelo</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.capacidade" id="colCapTrans">
                  <label class="form-check-label small" for="colCapTrans">Capacidade</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.responsavel" id="colRespTrans">
                  <label class="form-check-label small" for="colRespTrans">Responsável</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.acoes" id="colAcoesTrans">
                  <label class="form-check-label small" for="colAcoesTrans">Ações</label>
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
                <th class="azul" *ngIf="colunas.tipo">Tipo</th>
                <th class="azul" *ngIf="colunas.placa">Placa</th>
                <th class="azul" *ngIf="colunas.nome">Modelo</th>
                <th class="azul" *ngIf="colunas.capacidade">Capacidade</th>
                <th class="azul" *ngIf="colunas.responsavel">Responsável</th>
                <th class="azul text-center" *ngIf="colunas.acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of transportesFiltrados">
                <td *ngIf="colunas.id">{{ item.idTrans }}</td>
                <td *ngIf="colunas.tipo">{{ item.tipoTrans }}</td>
                <td *ngIf="colunas.placa">{{ item.placaTrans }}</td>
                <td *ngIf="colunas.nome">{{ item.nomeTrans }}</td>
                <td *ngIf="colunas.capacidade">{{ item.capacidadeTrans }}</td>
                <td *ngIf="colunas.responsavel">
                  <span class="badge" [class.bg-info]="item.tipoResponsavel === 'motorista'" [class.bg-warning]="item.tipoResponsavel === 'agregado'">
                    <i class="bi" [class.bi-person-badge]="item.tipoResponsavel === 'motorista'" [class.bi-truck]="item.tipoResponsavel === 'agregado'"></i>
                    {{ item.nomeResponsavel || item.responsavelTrans || 'Não definido' }}
                  </span>
                </td>
                <td class="text-center" *ngIf="colunas.acoes">
                  <button class="btn btn-sm btn-warning me-1" (click)="router.navigate(['/transportes/editar', item.idTrans])" title="Editar"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-sm btn-danger" (click)="deletar(item.idTrans!, item.nomeTrans)" title="Excluir"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="transportesFiltrados.length === 0">
                <td [attr.colspan]="contarColunas()" class="text-center"><i class="bi bi-inbox"></i> Nenhum transporte encontrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TransporteListComponent implements OnInit {
  transportes: Transporte[] = [];
  transportesFiltrados: Transporte[] = [];
  pesquisa: string = '';
  loading = false;
  
  filtroTipo: string = '';
  filtroPlaca: string = '';
  filtroNome: string = '';
  filtroResponsavel: string = '';
  
  colunas = {
    id: true,
    tipo: true,
    placa: true,
    nome: true,
    capacidade: true,
    responsavel: true,
    acoes: true
  };
  
  constructor(public router: Router, private service: TransporteService) {}
  ngOnInit(): void { 
    this.loading = true;
    this.service.listarTodos().subscribe({
      next: (data) => {
        this.transportes = data;
        this.transportesFiltrados = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  
  pesquisar(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.transportesFiltrados = this.transportes.filter(transporte => {
      const matchTipo = !this.filtroTipo || 
        transporte.tipoTrans?.toLowerCase().includes(this.filtroTipo.toLowerCase());
      const matchPlaca = !this.filtroPlaca || 
        transporte.placaTrans?.toLowerCase().includes(this.filtroPlaca.toLowerCase());
      const matchNome = !this.filtroNome || 
        transporte.nomeTrans?.toLowerCase().includes(this.filtroNome.toLowerCase());
      const matchResponsavel = !this.filtroResponsavel || 
        transporte.responsavelTrans?.toLowerCase().includes(this.filtroResponsavel.toLowerCase());
      const matchPesquisa = !this.pesquisa || 
        transporte.tipoTrans?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        transporte.placaTrans?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        transporte.nomeTrans?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        transporte.responsavelTrans?.toLowerCase().includes(this.pesquisa.toLowerCase());
      
      return matchTipo && matchPlaca && matchNome && matchResponsavel && matchPesquisa;
    });
  }

  limparFiltros(): void {
    this.filtroTipo = '';
    this.filtroPlaca = '';
    this.filtroNome = '';
    this.filtroResponsavel = '';
    this.pesquisa = '';
    this.aplicarFiltros();
  }

  contarColunas(): number {
    return Object.values(this.colunas).filter(v => v).length;
  }

  deletar(id: number, nome: string): void {
    if (confirm(`Excluir ${nome}?`)) this.service.deletar(id).subscribe(() => this.ngOnInit());
  }
}
