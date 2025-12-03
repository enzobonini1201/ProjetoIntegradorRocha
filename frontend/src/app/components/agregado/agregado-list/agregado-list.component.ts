import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgregadoService } from '../../../services/agregado.service';
import { Agregado } from '../../../models/agregado.model';

@Component({
  selector: 'app-agregado-list',
  templateUrl: './agregado-list.component.html',
  styleUrls: ['./agregado-list.component.css']
})
export class AgregadoListComponent implements OnInit {
  agregados: Agregado[] = [];
  agregadosFiltrados: Agregado[] = [];
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
    dataNascimento: true,
    endereco: true,
    cnh: true,
    dataValidade: true,
    acoes: true
  };

  constructor(
    private agregadoService: AgregadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAgregados();
  }

  carregarAgregados(): void {
    this.loading = true;
    this.agregadoService.listarTodos(this.pesquisa).subscribe({
      next: (data) => {
        this.agregados = data;
        this.agregadosFiltrados = data;
        this.loading = false;
        if (!this.pesquisa) {
          this.aplicarFiltros();
        }
      },
      error: (error) => {
        console.error('Erro:', error);
        this.error = 'Erro ao carregar agregados';
        this.loading = false;
      }
    });
  }

  pesquisar(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.agregadosFiltrados = this.agregados.filter(agregado => {
      const matchNome = !this.filtroNome || 
        agregado.nomeAgre?.toLowerCase().includes(this.filtroNome.toLowerCase());
      const matchTelefone = !this.filtroTelefone || 
        agregado.telefoneAgre?.toLowerCase().includes(this.filtroTelefone.toLowerCase());
      const matchCpf = !this.filtroCpf || 
        agregado.cpfAgre?.toLowerCase().includes(this.filtroCpf.toLowerCase());
      const matchCnh = !this.filtroCnh || 
        agregado.cnhAgre?.toLowerCase().includes(this.filtroCnh.toLowerCase());
      
      const matchPesquisa = !this.pesquisa ||
        agregado.nomeAgre?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        agregado.telefoneAgre?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        agregado.cpfAgre?.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        agregado.cnhAgre?.toLowerCase().includes(this.pesquisa.toLowerCase());
      
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
    this.router.navigate(['/agregados/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/agregados/editar', id]);
  }

  deletar(id: number, nome: string): void {
    if (confirm(`Deseja realmente excluir ${nome}?`)) {
      this.agregadoService.deletar(id).subscribe({
        next: () => {
          alert('Agregado excluído com sucesso!');
          this.carregarAgregados();
        },
        error: (error) => {
          console.error('Erro:', error);
          alert('Erro ao deletar agregado');
        }
      });
    }
  }
}
