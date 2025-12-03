import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotaService } from '../../../services/nota.service';
import { MotoristaService } from '../../../services/motorista.service';
import { AgregadoService } from '../../../services/agregado.service';
import { Motorista } from '../../../models/motorista.model';
import { Agregado } from '../../../models/agregado.model';

@Component({
  selector: 'app-nota-form',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-card-checklist"></i> {{ isEdit ? 'Editar' : 'Nova' }} Nota Fiscal</h3>
            </header>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-10 mx-auto">
            <div class="card card-custom">
              <div class="card-body">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <label class="form-label"><i class="bi bi-hash"></i> Número *</label>
                      <input type="number" class="form-control" formControlName="numeroNota" [class.is-invalid]="submitted && form.get('numeroNota')?.errors" placeholder="Número da nota">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('numeroNota')?.errors">Número é obrigatório</div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label class="form-label"><i class="bi bi-box-seam"></i> Quantidade *</label>
                      <input type="number" class="form-control" formControlName="qtdNota" [class.is-invalid]="submitted && form.get('qtdNota')?.errors" placeholder="Quantidade">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('qtdNota')?.errors">Quantidade é obrigatória</div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label class="form-label"><i class="bi bi-person-badge"></i> Cliente *</label>
                      <input type="text" class="form-control" formControlName="clienteNota" [class.is-invalid]="submitted && form.get('clienteNota')?.errors" placeholder="Nome do cliente">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('clienteNota')?.errors">Cliente é obrigatório</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-building"></i> Razão Social Destino *</label>
                      <input type="text" class="form-control" formControlName="razaosocialdestNota" [class.is-invalid]="submitted && form.get('razaosocialdestNota')?.errors" placeholder="Razão social do destinatário">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('razaosocialdestNota')?.errors">Razão social é obrigatória</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-geo-alt"></i> Cidade Destino *</label>
                      <input type="text" class="form-control" formControlName="cidadedestNota" [class.is-invalid]="submitted && form.get('cidadedestNota')?.errors" placeholder="Cidade - UF">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('cidadedestNota')?.errors">Cidade é obrigatória</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-file-text"></i> CNPJ Destino *</label>
                      <input type="text" class="form-control" formControlName="cnpjdestNota" [class.is-invalid]="submitted && form.get('cnpjdestNota')?.errors" placeholder="00.000.000/0000-00">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('cnpjdestNota')?.errors">CNPJ é obrigatório</div>
                    </div>

                    <!-- Coletado por -->
                    <div class="col-12 mb-3">
                      <hr class="my-4">
                      <h5 class="mb-3"><i class="bi bi-person"></i> Responsável pela Coleta *</h5>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Tipo *</label>
                      <div class="d-flex gap-3">
                        <div class="form-check">
                          <input class="form-check-input" type="radio" formControlName="tipoColetador" value="motorista" id="tipoColetadorMotorista" (change)="onTipoColetadorChange()">
                          <label class="form-check-label" for="tipoColetadorMotorista">
                            <i class="bi bi-truck"></i> Motorista
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" formControlName="tipoColetador" value="agregado" id="tipoColetadorAgregado" (change)="onTipoColetadorChange()">
                          <label class="form-check-label" for="tipoColetadorAgregado">
                            <i class="bi bi-person-badge"></i> Agregado
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Selecione o Responsável *</label>
                      <select class="form-select" formControlName="idColetador" (change)="onColetadorChange()" [class.is-invalid]="submitted && form.get('idColetador')?.errors">
                        <option value="">Selecione...</option>
                        <option *ngFor="let resp of listaColetadores" [value]="resp.id">{{ resp.nome }}</option>
                      </select>
                      <div class="invalid-feedback" *ngIf="submitted && form.get('idColetador')?.errors">Responsável pela coleta é obrigatório</div>
                    </div>

                    <!-- Entregue por -->
                    <div class="col-12 mb-3">
                      <hr class="my-4">
                      <h5 class="mb-3"><i class="bi bi-person-check"></i> Responsável pela Entrega (Opcional)</h5>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Tipo</label>
                      <div class="d-flex gap-3">
                        <div class="form-check">
                          <input class="form-check-input" type="radio" formControlName="tipoEntregador" value="motorista" id="tipoEntregadorMotorista" (change)="onTipoEntregadorChange()">
                          <label class="form-check-label" for="tipoEntregadorMotorista">
                            <i class="bi bi-truck"></i> Motorista
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" formControlName="tipoEntregador" value="agregado" id="tipoEntregadorAgregado" (change)="onTipoEntregadorChange()">
                          <label class="form-check-label" for="tipoEntregadorAgregado">
                            <i class="bi bi-person-badge"></i> Agregado
                          </label>
                        </div>
                      </div>
                      <small class="form-text text-muted">Deixe em branco se ainda não foi entregue</small>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Selecione o Responsável</label>
                      <select class="form-select" formControlName="idEntregador" (change)="onEntregadorChange()">
                        <option value="">Selecione...</option>
                        <option *ngFor="let resp of listaEntregadores" [value]="resp.id">{{ resp.nome }}</option>
                      </select>
                    </div>

                    <div class="col-12 mb-3">
                      <hr class="my-4">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-calendar"></i> Data Coleta *</label>
                      <input type="date" class="form-control" formControlName="datacoletaNota" [class.is-invalid]="submitted && form.get('datacoletaNota')?.errors">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('datacoletaNota')?.errors">Data de coleta é obrigatória</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-calendar-check"></i> Data Entrega</label>
                      <input type="date" class="form-control" formControlName="dataentregaNota">
                      <small class="form-text text-muted">Deixe em branco se ainda não foi entregue</small>
                    </div>
                  </div>
                  <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-secondary" (click)="router.navigate(['/notas'])" [disabled]="loading">
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
export class NotaFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;
  loading = false;
  submitted = false;

  // Listas para coletador e entregador
  listaColetadores: any[] = [];
  listaEntregadores: any[] = [];
  motoristas: Motorista[] = [];
  agregados: Agregado[] = [];

  constructor(
    private fb: FormBuilder, 
    private service: NotaService, 
    private motoristaService: MotoristaService,
    private agregadoService: AgregadoService,
    private route: ActivatedRoute, 
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numeroNota: ['', Validators.required],
      qtdNota: ['', Validators.required],
      razaosocialdestNota: ['', Validators.required],
      cidadedestNota: ['', Validators.required],
      cnpjdestNota: ['', Validators.required],
      coletadoporNota: [''],
      entregueporNota: [''],
      datacoletaNota: ['', Validators.required],
      dataentregaNota: [''],
      clienteNota: ['', Validators.required],
      tipoColetador: ['motorista', Validators.required],
      idColetador: ['', Validators.required],
      tipoEntregador: [''],
      idEntregador: ['']
    });

    // Adicionar máscara de CNPJ
    this.form.get('cnpjdestNota')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraCNPJ(value);
        if (formatted !== value) {
          this.form.get('cnpjdestNota')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    // Carregar motoristas e agregados
    this.motoristaService.listarTodos().subscribe((data: any) => {
      this.motoristas = data;
      this.onTipoColetadorChange(); // Inicializar lista
    });

    this.agregadoService.listarTodos().subscribe((data: any) => {
      this.agregados = data;
    });

    this.id = +this.route.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.service.buscarPorId(this.id).subscribe(data => this.form.patchValue(data));
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    const op = this.isEdit ? this.service.atualizar(this.id!, this.form.value) : this.service.criar(this.form.value);
    op.subscribe({
      next: () => {
        alert('Nota fiscal salva com sucesso!');
        this.router.navigate(['/notas']);
      },
      error: (error) => {
        console.error('Erro ao salvar nota fiscal:', error);
        if (error.status !== 401 && error.status !== 403) {
          alert('Erro ao salvar nota fiscal');
        }
        this.loading = false;
      }
    });
  }

  aplicarMascaraCNPJ(value: string): string {
    const numeros = value.replace(/\D/g, '').substring(0, 14);
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/-$/, '');
    } else {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5').replace(/-$/, '');
    }
  }

  onTipoColetadorChange(): void {
    const tipo = this.form.get('tipoColetador')?.value;
    if (tipo === 'motorista') {
      this.listaColetadores = this.motoristas.map(m => ({ id: m.idMoto, nome: m.nomeMoto }));
    } else if (tipo === 'agregado') {
      this.listaColetadores = this.agregados.map(a => ({ id: a.idAgre, nome: a.nomeAgre }));
    }
    this.form.patchValue({ idColetador: '' });
  }

  onColetadorChange(): void {
    const id = this.form.get('idColetador')?.value;
    const tipo = this.form.get('tipoColetador')?.value;
    if (id) {
      const responsavel = this.listaColetadores.find(r => r.id == id);
      if (responsavel) {
        this.form.patchValue({ 
          nomeColetador: responsavel.nome,
          coletadoporNota: responsavel.nome
        });
      }
    }
  }

  onTipoEntregadorChange(): void {
    const tipo = this.form.get('tipoEntregador')?.value;
    if (tipo === 'motorista') {
      this.listaEntregadores = this.motoristas.map(m => ({ id: m.idMoto, nome: m.nomeMoto }));
    } else if (tipo === 'agregado') {
      this.listaEntregadores = this.agregados.map(a => ({ id: a.idAgre, nome: a.nomeAgre }));
    }
    this.form.patchValue({ idEntregador: '' });
  }

  onEntregadorChange(): void {
    const id = this.form.get('idEntregador')?.value;
    const tipo = this.form.get('tipoEntregador')?.value;
    if (id) {
      const responsavel = this.listaEntregadores.find(r => r.id == id);
      if (responsavel) {
        this.form.patchValue({ 
          nomeEntregador: responsavel.nome,
          entregueporNota: responsavel.nome
        });
      }
    }
  }
}
