import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  error = '';
  
  senhaRequisitos = {
    minimo8: false,
    maiuscula: false,
    minuscula: false,
    numero: false,
    especial: false
  };

  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cadastroForm = this.formBuilder.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.minLength(14)]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmarSenha: ['', Validators.required]
    });
  }

  get f() {
    return this.cadastroForm.controls;
  }

  formatarCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    this.cadastroForm.patchValue({ cpf: value }, { emitEvent: false });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  verificarForcaSenha(): void {
    const senha = this.cadastroForm.get('senha')?.value || '';
    
    this.senhaRequisitos.minimo8 = senha.length >= 8;
    this.senhaRequisitos.maiuscula = /[A-Z]/.test(senha);
    this.senhaRequisitos.minuscula = /[a-z]/.test(senha);
    this.senhaRequisitos.numero = /[0-9]/.test(senha);
    this.senhaRequisitos.especial = /[@#$%^&+=!]/.test(senha);
  }

  validarSenha(senha: string): string | null {
    if (senha.length < 8) {
      return 'Senha deve ter no mínimo 8 caracteres';
    }
    if (!/[A-Z]/.test(senha)) {
      return 'Senha deve conter pelo menos 1 letra maiúscula';
    }
    if (!/[a-z]/.test(senha)) {
      return 'Senha deve conter pelo menos 1 letra minúscula';
    }
    if (!/[0-9]/.test(senha)) {
      return 'Senha deve conter pelo menos 1 número';
    }
    if (!/[@#$%^&+=!]/.test(senha)) {
      return 'Senha deve conter pelo menos 1 caractere especial (@#$%^&+=!)';
    }
    return null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.cadastroForm.invalid) {
      return;
    }

    const { nomeCompleto, cpf, senha, confirmarSenha } = this.cadastroForm.value;

    // Validar confirmação de senha ANTES de validar força
    if (senha !== confirmarSenha) {
      this.error = 'As senhas não conferem';
      return;
    }

    // Validar senha forte
    const erroSenha = this.validarSenha(senha);
    if (erroSenha) {
      this.error = erroSenha;
      return;
    }

    this.loading = true;

    const usuario = {
      nomeCompleto: nomeCompleto,
      cpf: cpf,
      senha: senha,
      confirmarSenha: confirmarSenha
    };

    this.http.post(`${this.apiUrl}/cadastro`, usuario)
      .subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.error = error.error?.message || 'Erro ao realizar cadastro. Tente novamente.';
          this.loading = false;
        }
      });
  }

  voltarLogin(): void {
    this.router.navigate(['/login']);
  }
}
