import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RotaService } from '../../../services/rota.service';
import { Rota } from '../../../models/rota.model';

@Component({
  selector: 'app-rota-list',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-map"></i> Rotas</h3>
            </header>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-8">
            <form (ngSubmit)="pesquisar()">
              <div class="input-group">
                <input type="text" class="form-control" [(ngModel)]="pesquisa" name="pesquisa" placeholder="Pesquisar por origem ou destino...">
                <button class="pesquisa cor" type="submit"><i class="bi bi-search"></i> Pesquisar</button>
              </div>
            </form>
          </div>
          <div class="col-md-4 text-end">
            <button class="btn btn-secondary me-2" data-bs-toggle="collapse" data-bs-target="#filtrosAvancados">
              <i class="bi bi-funnel"></i> Filtros
            </button>
            <button class="btn btn-primary" (click)="router.navigate(['/rotas/novo'])"><i class="bi bi-plus-circle"></i> Nova Rota</button>
          </div>
        </div>

        <!-- Filtros Avançados -->
        <div class="collapse mb-3" id="filtrosAvancados">
          <div class="card card-body">
            <h6><i class="bi bi-funnel-fill"></i> Filtros Avançados</h6>
            <div class="row g-2">
              <div class="col-md-3">
                <label class="form-label small">Origem</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroOrigem" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar origem...">
              </div>
              <div class="col-md-3">
                <label class="form-label small">Destino</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroDestino" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar destino...">
              </div>
              <div class="col-md-3">
                <label class="form-label small">Responsável</label>
                <input type="text" class="form-control form-control-sm" [(ngModel)]="filtroResponsavel" 
                       (ngModelChange)="aplicarFiltros()" placeholder="Filtrar responsável...">
              </div>
              <div class="col-md-2">
                <label class="form-label small">Tipo</label>
                <select class="form-select form-select-sm" [(ngModel)]="filtroTipo" (ngModelChange)="aplicarFiltros()">
                  <option value="">Todos</option>
                  <option value="motorista">Motorista</option>
                  <option value="agregado">Agregado</option>
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
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.id" id="colId">
                  <label class="form-check-label small" for="colId">ID</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.origem" id="colOrigem">
                  <label class="form-check-label small" for="colOrigem">Origem</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.destino" id="colDestino">
                  <label class="form-check-label small" for="colDestino">Destino</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.responsavel" id="colResp">
                  <label class="form-check-label small" for="colResp">Responsável</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.tipo" id="colTipo">
                  <label class="form-check-label small" for="colTipo">Tipo</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="colunas.acoes" id="colAcoes">
                  <label class="form-check-label small" for="colAcoes">Ações</label>
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
                <th class="azul" *ngIf="colunas.origem">Origem</th>
                <th class="azul" *ngIf="colunas.destino">Destino</th>
                <th class="azul" *ngIf="colunas.responsavel">Responsável</th>
                <th class="azul" *ngIf="colunas.tipo">Tipo</th>
                <th class="azul text-center" *ngIf="colunas.acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of rotasFiltradas">
                <td *ngIf="colunas.id">{{ item.idRota }}</td>
                <td *ngIf="colunas.origem"><i class="bi bi-geo-alt text-primary"></i> {{ item.origem }}</td>
                <td *ngIf="colunas.destino"><i class="bi bi-geo-alt-fill text-success"></i> {{ item.destino }}</td>
                <td *ngIf="colunas.responsavel">{{ item.nomeResponsavel || '-' }}</td>
                <td *ngIf="colunas.tipo">
                  <span *ngIf="item.tipoResponsavel === 'motorista'" class="badge bg-info">
                    <i class="bi bi-person-badge"></i> Motorista
                  </span>
                  <span *ngIf="item.tipoResponsavel === 'agregado'" class="badge bg-warning">
                    <i class="bi bi-truck"></i> Agregado
                  </span>
                  <span *ngIf="!item.tipoResponsavel">-</span>
                </td>
                <td class="text-center" *ngIf="colunas.acoes">
                  <button class="btn btn-sm btn-info me-1" 
                          (click)="item.coordenadasOrigem && item.coordenadasDestino ? visualizarMapa(item) : alertaSemMapa(item)" 
                          title="Visualizar Mapa">
                    <i class="bi bi-map"></i>
                  </button>
                  <button class="btn btn-sm btn-warning me-1" (click)="editar(item.idRota!)" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" (click)="deletar(item.idRota!, item.origem + ' - ' + item.destino)" title="Excluir">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="rotasFiltradas.length === 0">
                <td [attr.colspan]="contarColunas()" class="text-center"><i class="bi bi-inbox"></i> Nenhuma rota encontrada</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal do Mapa -->
        <div class="modal fade" id="mapaModal" tabindex="-1" *ngIf="rotaSelecionada">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <i class="bi bi-map"></i> Mapa da Rota
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="row mb-3">
                  <div class="col-md-4">
                    <div class="card">
                      <div class="card-body text-center">
                        <i class="bi bi-geo-alt text-primary fs-3"></i>
                        <h6 class="mt-2">Origem</h6>
                        <p class="mb-0">{{ rotaSelecionada.origem }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card">
                      <div class="card-body text-center">
                        <i class="bi bi-speedometer text-info fs-3"></i>
                        <h6 class="mt-2">Distância</h6>
                        <p class="mb-0">{{ rotaSelecionada.distanciaKm }} km</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card">
                      <div class="card-body text-center">
                        <i class="bi bi-clock text-warning fs-3"></i>
                        <h6 class="mt-2">Tempo Estimado</h6>
                        <p class="mb-0">{{ formatarTempo(rotaSelecionada.tempoEstimadoMinutos) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-12">
                    <div id="mapaVisualizar" style="height: 400px; border-radius: 8px; border: 2px solid #dee2e6;"></div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="card">
                      <div class="card-body text-center">
                        <i class="bi bi-geo-alt-fill text-success fs-3"></i>
                        <h6 class="mt-2">Destino</h6>
                        <p class="mb-0">{{ rotaSelecionada.destino }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card">
                      <div class="card-body text-center">
                        <i class="bi bi-person-badge text-info fs-3"></i>
                        <h6 class="mt-2">Responsável</h6>
                        <p class="mb-0">{{ rotaSelecionada.nomeResponsavel }} 
                          <span class="badge bg-secondary ms-2">{{ rotaSelecionada.tipoResponsavel }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RotaListComponent implements OnInit {
  rotas: Rota[] = [];
  rotasFiltradas: Rota[] = [];
  pesquisa: string = '';
  loading = false;
  rotaSelecionada?: Rota;
  private map: any;
  private L: any;
  
  // Filtros avançados
  filtroOrigem: string = '';
  filtroDestino: string = '';
  filtroResponsavel: string = '';
  filtroTipo: string = '';
  
  // Colunas visíveis
  colunas = {
    id: true,
    origem: true,
    destino: true,
    responsavel: true,
    tipo: true,
    acoes: true
  };
  
  constructor(public router: Router, private service: RotaService) {}
  
  ngOnInit(): void { 
    this.carregarLeaflet();
    this.loading = true;
    this.service.listarTodas().subscribe({
      next: (data) => {
        this.rotas = data;
        this.rotasFiltradas = data;
        console.log('Rotas carregadas:', data);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  carregarLeaflet(): void {
    if (!(window as any).L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        this.L = (window as any).L;
      };
      document.head.appendChild(script);
    } else {
      this.L = (window as any).L;
    }
  }
  
  pesquisar(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.rotasFiltradas = this.rotas.filter(r => {
      const matchOrigem = !this.filtroOrigem || r.origem.toLowerCase().includes(this.filtroOrigem.toLowerCase());
      const matchDestino = !this.filtroDestino || r.destino.toLowerCase().includes(this.filtroDestino.toLowerCase());
      const matchResponsavel = !this.filtroResponsavel || (r.nomeResponsavel && r.nomeResponsavel.toLowerCase().includes(this.filtroResponsavel.toLowerCase()));
      const matchTipo = !this.filtroTipo || r.tipoResponsavel === this.filtroTipo;
      
      const matchPesquisa = !this.pesquisa || 
        r.origem.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        r.destino.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        (r.nomeResponsavel && r.nomeResponsavel.toLowerCase().includes(this.pesquisa.toLowerCase()));
      
      return matchOrigem && matchDestino && matchResponsavel && matchTipo && matchPesquisa;
    });

    // Auto-ocultar colunas vazias
    if (this.filtroOrigem) this.colunas.origem = true; else this.verificarColuna('origem');
    if (this.filtroDestino) this.colunas.destino = true; else this.verificarColuna('destino');
    if (this.filtroResponsavel) this.colunas.responsavel = true; else this.verificarColuna('responsavel');
    if (this.filtroTipo) this.colunas.tipo = true; else this.verificarColuna('tipo');
  }

  verificarColuna(campo: string): void {
    // Mantém coluna visível se houver dados filtrados
  }

  limparFiltros(): void {
    this.filtroOrigem = '';
    this.filtroDestino = '';
    this.filtroResponsavel = '';
    this.filtroTipo = '';
    this.pesquisa = '';
    this.rotasFiltradas = this.rotas;
    this.colunas = {
      id: true,
      origem: true,
      destino: true,
      responsavel: true,
      tipo: true,
      acoes: true
    };
  }

  contarColunas(): number {
    return Object.values(this.colunas).filter(v => v).length;
  }

  visualizarMapa(rota: Rota): void {
    this.rotaSelecionada = rota;
    setTimeout(() => {
      const modalEl = document.getElementById('mapaModal');
      if (modalEl) {
        const modal = new (window as any).bootstrap.Modal(modalEl);
        modal.show();
        setTimeout(() => this.inicializarMapa(), 300);
      }
    }, 100);
  }

  inicializarMapa(): void {
    if (!this.L || !this.rotaSelecionada) return;

    const origem = JSON.parse(this.rotaSelecionada.coordenadasOrigem!);
    const destino = JSON.parse(this.rotaSelecionada.coordenadasDestino!);

    if (this.map) {
      this.map.remove();
    }

    this.map = this.L.map('mapaVisualizar').setView([origem.lat, origem.lng], 12);
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Marcadores
    this.L.marker([origem.lat, origem.lng]).addTo(this.map)
      .bindPopup('<b>Origem</b><br>' + this.rotaSelecionada.origem);
    this.L.marker([destino.lat, destino.lng]).addTo(this.map)
      .bindPopup('<b>Destino</b><br>' + this.rotaSelecionada.destino);

    // Linha da rota
    this.L.polyline([[origem.lat, origem.lng], [destino.lat, destino.lng]], {
      color: 'blue',
      weight: 3,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(this.map);

    // Ajustar zoom
    this.map.fitBounds([[origem.lat, origem.lng], [destino.lat, destino.lng]]);
  }

  formatarTempo(minutos?: number): string {
    if (!minutos) return '0 min';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas}h ${mins}min` : `${mins} min`;
  }

  editar(id: number): void {
    console.log('Editando rota ID:', id);
    this.router.navigate(['/rotas/editar', id]);
  }

  alertaSemMapa(rota: Rota): void {
    alert('Esta rota não possui coordenadas calculadas.\nClique em "Editar" e depois em "Calcular Rota" para gerar o mapa.');
  }

  deletar(id: number, nome: string): void {
    if (confirm(`Deseja realmente excluir a rota ${nome}?`)) {
      this.service.deletar(id).subscribe({
        next: () => {
          alert('Rota excluída com sucesso!');
          this.ngOnInit();
        },
        error: () => alert('Erro ao excluir rota!')
      });
    }
  }
}
