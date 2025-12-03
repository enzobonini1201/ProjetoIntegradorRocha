import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RotaService } from '../../../services/rota.service';
import { MotoristaService } from '../../../services/motorista.service';
import { AgregadoService } from '../../../services/agregado.service';
import { Motorista } from '../../../models/motorista.model';
import { Agregado } from '../../../models/agregado.model';

@Component({
  selector: 'app-rota-form',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-map"></i> {{ isEdit ? 'Editar' : 'Nova' }} Rota</h3>
            </header>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-10 mx-auto">
            <div class="card card-custom">
              <div class="card-body">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-geo-alt"></i> Origem *</label>
                      <input type="text" class="form-control" formControlName="origem" 
                             [class.is-invalid]="submitted && form.get('origem')?.errors" 
                             placeholder="Ex: São Paulo, SP">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('origem')?.errors">Origem é obrigatória</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-geo-alt-fill"></i> Destino *</label>
                      <input type="text" class="form-control" formControlName="destino" 
                             [class.is-invalid]="submitted && form.get('destino')?.errors" 
                             placeholder="Ex: Rio de Janeiro, RJ">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('destino')?.errors">Destino é obrigatório</div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-12">
                      <label class="form-label d-block"><i class="bi bi-person-check"></i> Tipo de Responsável *</label>
                      <div class="btn-group w-100" role="group">
                        <input type="radio" class="btn-check" name="tipoResponsavel" id="tipoMotorista" 
                               value="motorista" formControlName="tipoResponsavel" (change)="onTipoChange('motorista')">
                        <label class="btn btn-outline-info" for="tipoMotorista">
                          <i class="bi bi-person-badge"></i> Motorista
                        </label>
                        
                        <input type="radio" class="btn-check" name="tipoResponsavel" id="tipoAgregado" 
                               value="agregado" formControlName="tipoResponsavel" (change)="onTipoChange('agregado')">
                        <label class="btn btn-outline-warning" for="tipoAgregado">
                          <i class="bi bi-truck"></i> Agregado
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-3" *ngIf="form.get('tipoResponsavel')?.value">
                    <div class="col-12">
                      <label class="form-label">
                        <i class="bi bi-person"></i> 
                        {{ form.get('tipoResponsavel')?.value === 'motorista' ? 'Motorista' : 'Agregado' }} Responsável *
                      </label>
                      <select class="form-select" formControlName="idResponsavel" 
                              [class.is-invalid]="submitted && form.get('idResponsavel')?.errors"
                              (change)="onResponsavelChange()">
                        <option value="">Selecione...</option>
                        <option *ngFor="let item of listaResponsaveis" [value]="item.id">
                          {{ item.nome }}
                        </option>
                      </select>
                      <div class="invalid-feedback" *ngIf="submitted && form.get('idResponsavel')?.errors">
                        Selecione um responsável
                      </div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-12">
                      <button type="button" class="btn btn-secondary w-100" (click)="calcularRota()" 
                              [disabled]="!form.get('origem')?.value || !form.get('destino')?.value || calculandoRota">
                        <span *ngIf="calculandoRota" class="spinner-border spinner-border-sm me-2"></span>
                        <i class="bi bi-compass" *ngIf="!calculandoRota"></i>
                        {{ calculandoRota ? 'Calculando...' : 'Calcular Rota' }}
                      </button>
                    </div>
                  </div>

                  <!-- Mapa -->
                  <div class="row mb-3" *ngIf="mostrarMapa">
                    <div class="col-12">
                      <div id="map" style="height: 400px; border-radius: 8px; border: 2px solid #dee2e6;"></div>
                    </div>
                  </div>

                  <!-- Informações calculadas -->
                  <div class="row mb-3" *ngIf="mostrarMapa">
                    <div class="col-md-4">
                      <label class="form-label"><i class="bi bi-speedometer"></i> Distância</label>
                      <input type="text" class="form-control" [value]="(form.get('distanciaKm')?.value || 0) + ' km'" readonly>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label"><i class="bi bi-clock"></i> Tempo Estimado</label>
                      <input type="text" class="form-control" [value]="formatarTempo(form.get('tempoEstimadoMinutos')?.value)" readonly>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label"><i class="bi bi-geo"></i> Coordenadas</label>
                      <button type="button" class="btn btn-sm btn-info w-100" (click)="verCoordenadas()">
                        <i class="bi bi-eye"></i> Ver Coordenadas
                      </button>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-secondary" (click)="router.navigate(['/rotas'])" [disabled]="loading">
                      <i class="bi bi-arrow-left"></i> Voltar
                    </button>
                    <button type="submit" class="btn btn-primary" [disabled]="loading">
                      <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                      <i class="bi bi-check-circle" *ngIf="!loading"></i>
                      {{ loading ? 'Salvando...' : 'Salvar' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RotaFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;
  loading = false;
  submitted = false;
  calculandoRota = false;
  mostrarMapa = false;
  
  listaResponsaveis: any[] = [];
  motoristas: Motorista[] = [];
  agregados: Agregado[] = [];

  private map: any;
  private L: any;

  constructor(
    private fb: FormBuilder, 
    private service: RotaService, 
    private motoristaService: MotoristaService,
    private agregadoService: AgregadoService,
    private route: ActivatedRoute, 
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      origem: ['', Validators.required],
      destino: ['', Validators.required],
      tipoResponsavel: ['', Validators.required],
      idResponsavel: ['', Validators.required],
      nomeResponsavel: [''],
      distanciaKm: [''],
      tempoEstimadoMinutos: [''],
      coordenadasOrigem: [''],
      coordenadasDestino: ['']
    });

    // Carregar motoristas e agregados
    this.motoristaService.listarTodos().subscribe(data => this.motoristas = data);
    this.agregadoService.listarTodos().subscribe(data => this.agregados = data);

    this.id = +this.route.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.service.buscarPorId(this.id).subscribe(data => {
        this.form.patchValue(data);
        if (data.tipoResponsavel) {
          this.onTipoChange(data.tipoResponsavel);
        }
        if (data.coordenadasOrigem && data.coordenadasDestino) {
          this.mostrarMapa = true;
          setTimeout(() => this.inicializarMapa(data), 500);
        }
      });
    }

    // Carregar Leaflet dinamicamente
    this.carregarLeaflet();
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

  onTipoChange(tipo: string): void {
    this.form.patchValue({ idResponsavel: '', nomeResponsavel: '' });
    if (tipo === 'motorista') {
      this.listaResponsaveis = this.motoristas.map(m => ({ id: m.idMoto, nome: m.nomeMoto }));
    } else if (tipo === 'agregado') {
      this.listaResponsaveis = this.agregados.map(a => ({ id: a.idAgre, nome: a.nomeAgre }));
    }
  }

  onResponsavelChange(): void {
    const id = this.form.get('idResponsavel')?.value;
    const item = this.listaResponsaveis.find(r => r.id == id);
    if (item) {
      this.form.patchValue({ nomeResponsavel: item.nome });
    }
  }

  async calcularRota(): Promise<void> {
    const origem = this.form.get('origem')?.value;
    const destino = this.form.get('destino')?.value;
    
    if (!origem || !destino) return;

    this.calculandoRota = true;
    
    try {
      // Geocoding com Nominatim (OpenStreetMap)
      const coordOrigem = await this.geocode(origem);
      const coordDestino = await this.geocode(destino);

      // Calcular distância e tempo com OpenRouteService
      const rota = await this.calcularDistanciaTempo(coordOrigem, coordDestino);

      this.form.patchValue({
        coordenadasOrigem: JSON.stringify(coordOrigem),
        coordenadasDestino: JSON.stringify(coordDestino),
        distanciaKm: rota.distancia,
        tempoEstimadoMinutos: rota.tempo
      });

      this.mostrarMapa = true;
      setTimeout(() => this.inicializarMapa(), 500);
    } catch (error) {
      alert('Erro ao calcular rota. Verifique os endereços digitados.');
    } finally {
      this.calculandoRota = false;
    }
  }

  async geocode(endereco: string): Promise<{lat: number, lng: number}> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) throw new Error('Endereço não encontrado');
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }

  async calcularDistanciaTempo(origem: any, destino: any): Promise<{distancia: number, tempo: number}> {
    // Usando OpenRouteService (gratuito, requer API key)
    // Para simplificar, vamos calcular distância em linha reta (haversine)
    const distancia = this.calcularDistanciaHaversine(origem.lat, origem.lng, destino.lat, destino.lng);
    const tempo = Math.round((distancia / 80) * 60); // Estimativa: 80 km/h
    
    return { distancia: Math.round(distancia * 10) / 10, tempo };
  }

  calcularDistanciaHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  inicializarMapa(data?: any): void {
    if (!this.L) return;

    const origem = data?.coordenadasOrigem ? JSON.parse(data.coordenadasOrigem) : JSON.parse(this.form.get('coordenadasOrigem')?.value);
    const destino = data?.coordenadasDestino ? JSON.parse(data.coordenadasDestino) : JSON.parse(this.form.get('coordenadasDestino')?.value);

    if (this.map) {
      this.map.remove();
    }

    this.map = this.L.map('map').setView([origem.lat, origem.lng], 8);
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Marcadores
    this.L.marker([origem.lat, origem.lng]).addTo(this.map)
      .bindPopup('<b>Origem</b><br>' + this.form.get('origem')?.value);
    this.L.marker([destino.lat, destino.lng]).addTo(this.map)
      .bindPopup('<b>Destino</b><br>' + this.form.get('destino')?.value);

    // Linha da rota
    this.L.polyline([[origem.lat, origem.lng], [destino.lat, destino.lng]], {
      color: 'blue',
      weight: 3,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(this.map);

    // Ajustar zoom para mostrar ambos os pontos
    this.map.fitBounds([[origem.lat, origem.lng], [destino.lat, destino.lng]]);
  }

  formatarTempo(minutos: number): string {
    if (!minutos) return '0 min';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas}h ${mins}min` : `${mins} min`;
  }

  verCoordenadas(): void {
    const origem = this.form.get('coordenadasOrigem')?.value;
    const destino = this.form.get('coordenadasDestino')?.value;
    alert(`Origem: ${origem}\nDestino: ${destino}`);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    const op = this.isEdit ? this.service.atualizar(this.id!, this.form.value) : this.service.criar(this.form.value);
    op.subscribe({
      next: () => {
        alert('Rota salva com sucesso!');
        this.router.navigate(['/rotas']);
      },
      error: () => {
        alert('Erro ao salvar rota');
        this.loading = false;
      }
    });
  }
}
