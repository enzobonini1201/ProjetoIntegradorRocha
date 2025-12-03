import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MotoristaService } from '../../services/motorista.service';
import { ClienteService } from '../../services/cliente.service';
import { NotaService } from '../../services/nota.service';
import { TransporteService } from '../../services/transporte.service';
import { Nota } from '../../models/nota.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  nomeUsuario: string = '';
  totalMotoristas: number = 0;
  totalClientes: number = 0;
  totalNotas: number = 0;
  totalTransportes: number = 0;
  notasPendentes: Nota[] = [];
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private motoristaService: MotoristaService,
    private clienteService: ClienteService,
    private notaService: NotaService,
    private transporteService: TransporteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.nomeUsuario = user.nome;
    }

    this.carregarDashboard();
  }

  carregarDashboard(): void {
    forkJoin({
      motoristas: this.motoristaService.listarTodos(),
      clientes: this.clienteService.listarTodos(),
      notas: this.notaService.listarTodas(),
      transportes: this.transporteService.listarTodos(),
      pendentes: this.notaService.listarPendentes()
    }).subscribe({
      next: (result) => {
        this.totalMotoristas = result.motoristas.length;
        this.totalClientes = result.clientes.length;
        this.totalNotas = result.notas.length;
        this.totalTransportes = result.transportes.length;
        this.notasPendentes = result.pendentes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dashboard:', error);
        this.loading = false;
      }
    });
  }

  getClasseStatus(nota: Nota): string {
    if (!nota.diasRestantes) return 'text-danger';
    if (nota.diasRestantes <= 1) return 'text-danger';
    if (nota.diasRestantes === 2) return 'text-warning';
    return 'text-success';
  }

  getIconeStatus(nota: Nota): string {
    if (!nota.diasRestantes || nota.diasRestantes <= 1) return 'bi-exclamation-circle-fill';
    if (nota.diasRestantes === 2) return 'bi-exclamation-triangle-fill';
    return 'bi-check-circle-fill';
  }

  navegar(rota: string): void {
    this.router.navigate([rota]);
  }
}
