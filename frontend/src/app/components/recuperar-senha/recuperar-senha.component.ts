import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent implements OnInit {
  recuperarForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = false;
  mensagemSucesso = '';
  mensagemErro = '';

  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.recuperarForm = this.formBuilder.group({
      cpf: ['', [Validators.required, Validators.minLength(14)]],
      novaSenha: ['', [Validators.required, Validators.minLength(8)]],
      confirmarSenha: ['', Validators.required]
    });
  }

  get f() {
    return this.recuperarForm.controls;
  }

  formatarCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    this.recuperarForm.patchValue({ cpf: value }, { emitEvent: false });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = false;
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (this.recuperarForm.invalid) {
      return;
    }

    const { cpf, novaSenha, confirmarSenha } = this.recuperarForm.value;

    // Validar se senhas coincidem
    if (novaSenha !== confirmarSenha) {
      this.mensagemErro = 'As senhas não coincidem';
      return;
    }

    // Validar força da senha
    if (novaSenha.length < 8) {
      this.mensagemErro = 'A senha deve ter no mínimo 8 caracteres';
      return;
    }

    const senhaRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!]).+$/;
    if (!senhaRegex.test(novaSenha)) {
      this.mensagemErro = 'A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caractere especial (@#$%^&+=!)';
      return;
    }

    this.loading = true;

    this.http.post<any>(`${this.apiUrl}/recuperar-senha`, { cpf, novaSenha })
      .subscribe({
        next: (response) => {
          this.success = true;
          this.mensagemSucesso = response.message || 'Senha alterada com sucesso!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.error = error.error?.message || 'CPF não encontrado no sistema.';
          this.mensagemErro = this.error;
          this.loading = false;
        }
      });
  }

  voltarLogin(): void {
    this.router.navigate(['/login']);
  }
}
