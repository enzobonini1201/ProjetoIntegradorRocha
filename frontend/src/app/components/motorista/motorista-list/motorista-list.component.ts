import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MotoristaService } from '../../../services/motorista.service';
import { Motorista } from '../../../models/motorista.model';

@Component({
  selector: 'app-motorista-list',
  templateUrl: './motorista-list.component.html',
  styleUrls: ['./motorista-list.component.css']
})
export class MotoristaListComponent implements OnInit {
  motoristas: Motorista[] = [];
  motoristasFiltrados: Motorista[] = [];
  loading: boolean = true;
  pesquisa: string = '';
  error: string = '';

  // Filtros
  filtroNome: string = '';
  filtroTelefone: string = '';
  filtroCpf: string = '';
  filtroCnh: string = '';
  
  colunas = {
    id: true,
    nome: true,
    telefone: true,
    cpf: true,
    cnh: true,
    endereco: true,
    dataNasc: true,
    dataValidade: true,
    acoes: true
  };

  constructor(
    private motoristaService: MotoristaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarMotoristas();
  }

  carregarMotoristas(): void {
    this.loading = true;
    this.motoristaService.listarTodos(this.pesquisa)
      .subscribe({
        next: (data) => {
          this.motoristas = data;
          this.motoristasFiltrados = data;
          this.loading = false;
          if (!this.pesquisa) {
            this.aplicarFiltros();
          }
        },
        error: (error) => {
          console.error('Erro ao carregar motoristas:', error);
          this.error = 'Erro ao carregar motoristas';
          this.loading = false;
        }
      });
  }

  pesquisar(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.motoristasFiltrados = this.motoristas.filter(motorista => {
      const matchNome = !this.filtroNome || 
        motorista.nomeMoto?.toLowerCase().includes(this.filtroNome.toLowerCase());
      const matchTelefone = !this.filtroTelefone || 
        motorista.telefoneMoto?.toLowerCase().includes(this.filtroTelefone.toLowerCase());
      const matchCpf = !this.filtroCpf || 
        motorista.cpfMoto?.toLowerCase().includes(this.filtroCpf.toLowerCase());
      const matchCnh = !this.filtroCnh || 
        motorista.cnhMoto?.toLowerCase().includes(this.filtroCnh.toLowerCase());
      
      const matchPesquisa = !this.pesquisa ||
        motorista.nomeMoto?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        motorista.telefoneMoto?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        motorista.cpfMoto?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        motorista.cnhMoto?.toLowerCase().includes(this.pesquisa.toLowerCase());
      
      return matchNome && matchTelefone && matchCpf && matchCnh && matchPesquisa;
    });
  }

  limparFiltros(): void {
    this.filtroNome = '';
    this.filtroTelefone = '';
    this.filtroCpf = '';
    this.filtroCnh = '';
    this.pesquisa = '';
    this.aplicarFiltros();
  }

  contarColunas(): number {
    return Object.values(this.colunas).filter(v => v).length;
  }

  novo(): void {
    this.router.navigate(['/motoristas/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/motoristas/editar', id]);
  }

  deletar(id: number, nome: string): void {
    if (confirm(`Deseja realmente excluir o motorista ${nome}?`)) {
      this.motoristaService.deletar(id)
        .subscribe({
          next: () => {
            alert('Motorista excluído com sucesso!');
            this.carregarMotoristas();
          },
          error: (error) => {
            console.error('Erro ao deletar motorista:', error);
            alert('Erro ao deletar motorista');
          }
        });
    }
  }
}
