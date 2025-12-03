import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AjudanteService } from '../../../services/ajudante.service';

@Component({
  selector: 'app-ajudante-form',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-people"></i> {{ isEdit ? 'Editar' : 'Novo' }} Ajudante</h3>
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
                      <label class="form-label"><i class="bi bi-person"></i> Nome Completo *</label>
                      <input type="text" class="form-control" formControlName="nomeAjuda" placeholder="Digite o nome completo">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-telephone"></i> Telefone *</label>
                      <input type="text" class="form-control" formControlName="telefoneAjuda" placeholder="(11) 98765-4321">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-card-text"></i> CPF *</label>
                      <input type="text" class="form-control" formControlName="cpfAjuda" placeholder="000.000.000-00">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-calendar"></i> Data Nascimento *</label>
                      <input type="date" class="form-control" formControlName="datanascAjuda">
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label"><i class="bi bi-geo-alt"></i> Endereço Completo *</label>
                      <input type="text" class="form-control" formControlName="enderecoAjuda" placeholder="Rua, número, bairro, cidade - UF">
                    </div>
                  </div>
                  <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-secondary" (click)="router.navigate(['/ajudantes'])">Voltar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
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
export class AjudanteFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private service: AjudanteService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nomeAjuda: ['', Validators.required],
      telefoneAjuda: ['', Validators.required],
      datanascAjuda: ['', Validators.required],
      cpfAjuda: ['', Validators.required],
      enderecoAjuda: ['', Validators.required]
    });

    // Adicionar máscara de telefone
    this.form.get('telefoneAjuda')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraTelefone(value);
        if (formatted !== value) {
          this.form.get('telefoneAjuda')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    // Adicionar máscara de CPF
    this.form.get('cpfAjuda')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraCPF(value);
        if (formatted !== value) {
          this.form.get('cpfAjuda')?.setValue(formatted, { emitEvent: false });
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
    if (this.form.invalid) return;
    const op = this.isEdit 
      ? this.service.atualizar(this.id!, this.form.value)
      : this.service.criar(this.form.value);
    op.subscribe({
      next: () => this.router.navigate(['/ajudantes']),
      error: (error) => {
        console.error('Erro ao salvar ajudante:', error);
        if (error.status !== 401 && error.status !== 403) {
          alert('Erro ao salvar ajudante');
        }
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

  aplicarMascaraCPF(value: string): string {
    const numeros = value.replace(/\D/g, '').substring(0, 11);
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/-$/, '');
  }
}
