import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransporteService } from '../../../services/transporte.service';
import { MotoristaService } from '../../../services/motorista.service';
import { AgregadoService } from '../../../services/agregado.service';
import { Motorista } from '../../../models/motorista.model';
import { Agregado } from '../../../models/agregado.model';

@Component({
  selector: 'app-transporte-form',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-truck-front"></i> {{ isEdit ? 'Editar' : 'Novo' }} Transporte</h3>
            </header>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card card-custom">
              <div class="card-body">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-tag"></i> Tipo *</label>
                      <input type="text" class="form-control" formControlName="tipoTrans" [class.is-invalid]="submitted && form.get('tipoTrans')?.errors" placeholder="Caminhão, Carreta, etc.">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('tipoTrans')?.errors">Tipo é obrigatório</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-credit-card-2-front"></i> Placa *</label>
                      <input type="text" class="form-control" formControlName="placaTrans" [class.is-invalid]="submitted && form.get('placaTrans')?.errors" placeholder="ABC-1234">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('placaTrans')?.errors">Placa é obrigatória</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-truck"></i> Modelo *</label>
                      <input type="text" class="form-control" formControlName="nomeTrans" [class.is-invalid]="submitted && form.get('nomeTrans')?.errors" placeholder="Modelo do veículo">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('nomeTrans')?.errors">Modelo é obrigatório</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-boxes"></i> Capacidade *</label>
                      <input type="text" class="form-control" formControlName="capacidadeTrans" [class.is-invalid]="submitted && form.get('capacidadeTrans')?.errors" placeholder="Ex: 10 toneladas">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('capacidadeTrans')?.errors">Capacidade é obrigatória</div>
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

                  <div class="row" *ngIf="form.get('tipoResponsavel')?.value">
                    <div class="col-12 mb-3">
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

                  <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-secondary" (click)="router.navigate(['/transportes'])" [disabled]="loading">
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
export class TransporteFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;
  loading = false;
  submitted = false;
  
  listaResponsaveis: any[] = [];
  motoristas: Motorista[] = [];
  agregados: Agregado[] = [];

  constructor(
    private fb: FormBuilder, 
    private service: TransporteService,
    private motoristaService: MotoristaService,
    private agregadoService: AgregadoService,
    private route: ActivatedRoute, 
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoTrans: ['', Validators.required],
      placaTrans: ['', Validators.required],
      capacidadeTrans: ['', Validators.required],
      nomeTrans: ['', Validators.required],
      tipoResponsavel: ['', Validators.required],
      idResponsavel: ['', Validators.required],
      nomeResponsavel: ['']
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
      });
    }
  }

  onTipoChange(tipo: string): void {
    this.form.patchValue({ idResponsavel: '', nomeResponsavel: '' });
    if (tipo === 'motorista') {
      this.listaResponsaveis = this.motoristas.map(m => ({
        id: m.idMoto,
        nome: m.nomeMoto
      }));
    } else {
      this.listaResponsaveis = this.agregados.map(a => ({
        id: a.idAgre,
        nome: a.nomeAgre
      }));
    }
  }

  onResponsavelChange(): void {
    const id = this.form.get('idResponsavel')?.value;
    if (id) {
      const selecionado = this.listaResponsaveis.find(r => r.id == id);
      if (selecionado) {
        this.form.patchValue({ nomeResponsavel: selecionado.nome });
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    const op = this.isEdit ? this.service.atualizar(this.id!, this.form.value) : this.service.criar(this.form.value);
    op.subscribe({
      next: () => {
        alert('Transporte salvo com sucesso!');
        this.router.navigate(['/transportes']);
      },
      error: (error) => {
        console.error('Erro ao salvar transporte:', error);
        if (error.status !== 401 && error.status !== 403) {
          alert('Erro ao salvar transporte');
        }
        this.loading = false;
      }
    });
  }
}
