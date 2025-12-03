import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {
    login: '',
    nome: ''
  };
  
  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';
  
  loading: boolean = false;
  loadingPerfil: boolean = false;
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  mensagemErroSenha: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.loadingPerfil = true;
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.usuario = data;
        this.loadingPerfil = false;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.mensagemErro = 'Erro ao carregar informações do perfil';
        this.loadingPerfil = false;
      }
    });
  }

  alterarSenha(): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';
    this.mensagemErroSenha = '';

    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.mensagemErroSenha = 'Todos os campos são obrigatórios';
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.mensagemErroSenha = 'As senhas não coincidem';
      return;
    }

    if (this.novaSenha.length < 8) {
      this.mensagemErroSenha = 'A nova senha deve ter no mínimo 8 caracteres';
      return;
    }

    const senhaRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!]).+$/;
    if (!senhaRegex.test(this.novaSenha)) {
      this.mensagemErroSenha = 'A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caractere especial (@#$%^&+=!)';
      return;
    }

    this.loading = true;

    this.authService.alterarSenha({
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha
    }).subscribe({
      next: () => {
        this.mensagemSucesso = 'Senha alterada com sucesso!';
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
        this.loading = false;
        
        setTimeout(() => {
          this.mensagemSucesso = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Erro ao alterar senha:', error);
        if (error.status === 401) {
          this.mensagemErroSenha = 'Senha atual incorreta';
        } else {
          this.mensagemErroSenha = 'Erro ao alterar senha. Tente novamente.';
        }
        this.loading = false;
      }
    });
  }
}
