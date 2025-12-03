import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-briefcase"></i> {{ isEdit ? 'Editar' : 'Novo' }} Cliente</h3>
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
                      <label class="form-label"><i class="bi bi-building"></i> Razão Social *</label>
                      <input type="text" class="form-control" formControlName="razaosocialCliente" [class.is-invalid]="submitted && form.get('razaosocialCliente')?.errors" placeholder="Digite a razão social">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('razaosocialCliente')?.errors">Razão social é obrigatória</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-file-text"></i> CNPJ *</label>
                      <input type="text" class="form-control" formControlName="cnpjCliente" [class.is-invalid]="submitted && form.get('cnpjCliente')?.errors" placeholder="00.000.000/0000-00">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('cnpjCliente')?.errors">CNPJ é obrigatório</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-telephone"></i> Telefone *</label>
                      <input type="text" class="form-control" formControlName="telefoneCliente" [class.is-invalid]="submitted && form.get('telefoneCliente')?.errors" placeholder="(11) 98765-4321">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('telefoneCliente')?.errors">Telefone é obrigatório</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-mailbox"></i> CEP *</label>
                      <input type="text" class="form-control" formControlName="cepCliente" [class.is-invalid]="submitted && form.get('cepCliente')?.errors" placeholder="00000-000">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('cepCliente')?.errors">CEP é obrigatório</div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-secondary" (click)="router.navigate(['/clientes'])" [disabled]="loading">
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
export class ClienteFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;
  loading = false;
  submitted = false;

  constructor(private fb: FormBuilder, private service: ClienteService, private route: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      telefoneCliente: ['', Validators.required],
      razaosocialCliente: ['', Validators.required],
      cnpjCliente: ['', Validators.required],
      cepCliente: ['', Validators.required]
    });

    // Adicionar máscara de telefone
    this.form.get('telefoneCliente')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraTelefone(value);
        if (formatted !== value) {
          this.form.get('telefoneCliente')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    // Adicionar máscara de CNPJ
    this.form.get('cnpjCliente')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraCNPJ(value);
        if (formatted !== value) {
          this.form.get('cnpjCliente')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    // Adicionar máscara de CEP
    this.form.get('cepCliente')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraCEP(value);
        if (formatted !== value) {
          this.form.get('cepCliente')?.setValue(formatted, { emitEvent: false });
        }
      }
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
        alert('Cliente salvo com sucesso!');
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        console.error('Erro ao salvar cliente:', error);
        if (error.status !== 401 && error.status !== 403) {
          alert('Erro ao salvar cliente');
        }
        this.loading = false;
      }
    });
  }

  aplicarMascaraTelefone(value: string): string {
    const numeros = value.replace(/\D/g, '');
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
  }

  aplicarMascaraCNPJ(value: string): string {
    const numeros = value.replace(/\D/g, '').substring(0, 14);
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/-$/, '');
    } else {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5').replace(/-$/, '');
    }
  }

  aplicarMascaraCEP(value: string): string {
    const numeros = value.replace(/\D/g, '').substring(0, 8);
    return numeros.replace(/(\d{5})(\d{0,3})/, '$1-$2').replace(/-$/, '');
  }
}
