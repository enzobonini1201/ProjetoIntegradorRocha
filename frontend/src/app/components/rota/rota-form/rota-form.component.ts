import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NotaService } from '../../../services/nota.service';
import { RotaService } from '../../../services/rota.service';
import { MotoristaService } from '../../../services/motorista.service';
import { AgregadoService } from '../../../services/agregado.service';
import { ClienteService } from '../../../services/cliente.service';
import { TransporteService } from '../../../services/transporte.service';
import { AjudanteService } from '../../../services/ajudante.service';
import { Motorista } from '../../../models/motorista.model';
import { Agregado } from '../../../models/agregado.model';
import { Cliente } from '../../../models/cliente.model';
import { Transporte } from '../../../models/transporte.model';
import { Ajudante } from '../../../models/ajudante.model';
import { Nota } from '../../../models/nota.model';
import { Rota } from '../../../models/rota.model';

@Component({
  selector: 'app-rota-form',
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <header>
              <h3><i class="bi bi-map"></i> {{ isEdit ? 'Editar' : 'Nova' }} Nota pela Rota</h3>
              <p class="text-muted mb-0">Cadastro alternativo que grava diretamente em notas fiscais.</p>
            </header>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-11 mx-auto">
            <div class="card card-custom">
              <div class="card-body">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="row">
                    <div class="col-12">
                      <hr class="my-4">
                      <h5 class="mb-3"><i class="bi bi-signpost-split"></i> Controle da Rota</h5>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-geo-alt"></i> Origem *</label>
                      <input type="text" class="form-control" formControlName="origem" [class.is-invalid]="submitted && form.get('origem')?.errors" placeholder="Ex: São Paulo, SP">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('origem')?.errors">Origem é obrigatória</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-geo-alt-fill"></i> Destino *</label>
                      <input type="text" class="form-control" formControlName="destino" [class.is-invalid]="submitted && form.get('destino')?.errors" placeholder="Ex: Rio de Janeiro, RJ">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('destino')?.errors">Destino é obrigatório</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label d-block">Tipo de Responsável *</label>
                      <div class="d-flex gap-3 flex-wrap">
                        <div class="form-check">
                          <input class="form-check-input" type="radio" formControlName="tipoResponsavel" value="motorista" id="rotaTipoMotorista" (change)="onTipoResponsavelChange()">
                          <label class="form-check-label" for="rotaTipoMotorista"><i class="bi bi-truck"></i> Motorista</label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" formControlName="tipoResponsavel" value="agregado" id="rotaTipoAgregado" (change)="onTipoResponsavelChange()">
                          <label class="form-check-label" for="rotaTipoAgregado"><i class="bi bi-person-badge"></i> Agregado</label>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Responsável *</label>
                      <div class="input-group">
                        <select class="form-select" formControlName="idResponsavel" (change)="onResponsavelRotaChange()" [class.is-invalid]="submitted && form.get('idResponsavel')?.errors">
                          <option value="">Selecione...</option>
                          <option *ngFor="let resp of listaResponsaveisRota" [value]="resp.id">{{ resp.nome }}</option>
                        </select>
                        <button type="button" class="btn btn-outline-primary" (click)="abrirCadastro(form.get('tipoResponsavel')?.value === 'agregado' ? '/agregados/novo' : '/motoristas/novo')">
                          <i class="bi bi-plus-circle"></i> Adicionar novo
                        </button>
                      </div>
                      <div class="invalid-feedback d-block" *ngIf="submitted && form.get('idResponsavel')?.errors">Selecione um responsável</div>
                    </div>
                  </div>

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
                      <label class="form-label"><i class="bi bi-calendar"></i> Data Coleta *</label>
                      <input type="date" class="form-control" formControlName="datacoletaNota" [class.is-invalid]="submitted && form.get('datacoletaNota')?.errors">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('datacoletaNota')?.errors">Data de coleta é obrigatória</div>
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
                      <label class="form-label"><i class="bi bi-file-earmark-text"></i> CNPJ Destino *</label>
                      <input type="text" class="form-control" formControlName="cnpjdestNota" [class.is-invalid]="submitted && form.get('cnpjdestNota')?.errors" placeholder="00.000.000/0000-00">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('cnpjdestNota')?.errors">CNPJ é obrigatório</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-calendar-check"></i> Data Entrega</label>
                      <input type="date" class="form-control" formControlName="dataentregaNota">
                      <small class="form-text text-muted">Deixe em branco se ainda não foi entregue</small>
                    </div>
                  </div>

                  <div class="row align-items-end mb-3">
                    <div class="col-12">
                      <hr class="my-4">
                      <h5 class="mb-3"><i class="bi bi-person"></i> Cliente e Responsáveis</h5>
                    </div>
                    <div class="col-md-8 mb-3">
                      <label class="form-label">Cliente *</label>
                      <div class="input-group">
                        <select class="form-select" formControlName="idCliente" (change)="onClienteChange()" [class.is-invalid]="submitted && form.get('idCliente')?.errors">
                          <option value="">Selecione...</option>
                          <option *ngFor="let cliente of clientes" [value]="cliente.idCliente">
                            {{ cliente.razaosocialCliente }}
                          </option>
                        </select>
                        <button type="button" class="btn btn-outline-primary" (click)="abrirCadastro('/clientes/novo')">
                          <i class="bi bi-plus-circle"></i> Adicionar novo
                        </button>
                      </div>
                      <div class="invalid-feedback d-block" *ngIf="submitted && form.get('idCliente')?.errors">Cliente é obrigatório</div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label class="form-label">Cliente selecionado</label>
                      <input type="text" class="form-control" formControlName="clienteNota" readonly>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label class="form-label">Tipo da coleta *</label>
                      <div class="d-flex gap-3 flex-wrap">
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
                      <label class="form-label">Responsável pela coleta *</label>
                      <div class="input-group">
                        <select class="form-select" formControlName="idColetador" (change)="onColetadorChange()" [class.is-invalid]="submitted && form.get('idColetador')?.errors">
                          <option value="">Selecione...</option>
                          <option *ngFor="let resp of listaColetadores" [value]="resp.id">{{ resp.nome }}</option>
                        </select>
                        <button type="button" class="btn btn-outline-primary" (click)="abrirCadastro(form.get('tipoColetador')?.value === 'agregado' ? '/agregados/novo' : '/motoristas/novo')">
                          <i class="bi bi-plus-circle"></i> Adicionar novo
                        </button>
                      </div>
                      <div class="invalid-feedback d-block" *ngIf="submitted && form.get('idColetador')?.errors">Selecione um responsável</div>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label class="form-label">Tipo da entrega</label>
                      <div class="d-flex gap-3 flex-wrap">
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
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Responsável pela entrega</label>
                      <div class="input-group">
                        <select class="form-select" formControlName="idEntregador" (change)="onEntregadorChange()">
                          <option value="">Selecione...</option>
                          <option *ngFor="let resp of listaEntregadores" [value]="resp.id">{{ resp.nome }}</option>
                        </select>
                        <button type="button" class="btn btn-outline-primary" (click)="abrirCadastro(form.get('tipoEntregador')?.value === 'agregado' ? '/agregados/novo' : '/motoristas/novo')">
                          <i class="bi bi-plus-circle"></i> Adicionar novo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="row align-items-end mb-3">
                    <div class="col-12">
                      <hr class="my-4">
                      <h5 class="mb-3"><i class="bi bi-truck"></i> Veículo e Ajudantes</h5>
                    </div>
                    <div class="col-md-8 mb-3">
                      <label class="form-label">Veículo *</label>
                      <div class="input-group">
                        <select class="form-select" formControlName="idVeiculo" (change)="onVeiculoChange()" [class.is-invalid]="submitted && form.get('idVeiculo')?.errors">
                          <option value="">Selecione...</option>
                          <option *ngFor="let veiculo of transportes" [value]="veiculo.idTrans">
                            {{ veiculo.nomeTrans }} - {{ veiculo.placaTrans }}
                          </option>
                        </select>
                        <button type="button" class="btn btn-outline-primary" (click)="abrirCadastro('/transportes/novo')">
                          <i class="bi bi-plus-circle"></i> Adicionar novo
                        </button>
                      </div>
                      <div class="invalid-feedback d-block" *ngIf="submitted && form.get('idVeiculo')?.errors">Veículo é obrigatório</div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label class="form-label">Veículo selecionado</label>
                      <input type="text" class="form-control" formControlName="nomeVeiculo" readonly>
                    </div>

                    <div class="col-12 mb-3">
                      <label class="form-label d-block">Ajudantes</label>
                      <div class="input-group mb-2">
                        <button type="button" class="btn btn-outline-primary" (click)="abrirCadastro('/ajudantes/novo')">
                          <i class="bi bi-plus-circle"></i> Adicionar novo
                        </button>
                      </div>
                      <div class="row g-2 border rounded p-3" style="max-height: 220px; overflow-y: auto;">
                        <div class="col-md-4" *ngFor="let ajudante of ajudantes">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" [id]="'ajudante_' + ajudante.idAjuda" [checked]="ajudantesSelecionadosIds.includes(ajudante.idAjuda!)" (change)="toggleAjudante(ajudante.idAjuda!, $event)">
                            <label class="form-check-label" [for]="'ajudante_' + ajudante.idAjuda">{{ ajudante.nomeAjuda }}</label>
                          </div>
                        </div>
                      </div>
                      <small class="form-text text-muted d-block mt-2">Marque quantos ajudantes quiser.</small>
                      <div class="mt-2">
                        <span *ngIf="ajudantesSelecionadosTexto.length === 0" class="text-muted">Nenhum ajudante selecionado</span>
                        <span *ngFor="let nome of ajudantesSelecionadosTexto" class="badge bg-secondary me-1 mb-1">{{ nome }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12">
                      <hr class="my-4">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-geo-alt"></i> Razão Social Destino *</label>
                      <input type="text" class="form-control" formControlName="razaosocialdestNota" [class.is-invalid]="submitted && form.get('razaosocialdestNota')?.errors" placeholder="Razão social do destinatário">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('razaosocialdestNota')?.errors">Razão social é obrigatória</div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-geo-alt-fill"></i> Cidade Destino *</label>
                      <input type="text" class="form-control" formControlName="cidadedestNota" [class.is-invalid]="submitted && form.get('cidadedestNota')?.errors" placeholder="Cidade - UF">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('cidadedestNota')?.errors">Cidade é obrigatória</div>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-calendar-check"></i> Data Entrega</label>
                      <input type="date" class="form-control" formControlName="dataentregaNota">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label"><i class="bi bi-file-text"></i> CNPJ Destino *</label>
                      <input type="text" class="form-control" formControlName="cnpjdestNota" [class.is-invalid]="submitted && form.get('cnpjdestNota')?.errors" placeholder="00.000.000/0000-00">
                      <div class="invalid-feedback" *ngIf="submitted && form.get('cnpjdestNota')?.errors">CNPJ é obrigatório</div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-secondary" (click)="router.navigate(['/notas'])" [disabled]="loading">
                      <i class="bi bi-arrow-left"></i> Voltar para notas
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
export class RotaFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id?: number;
  loading = false;
  submitted = false;

  listaColetadores: Array<{ id: number; nome: string }> = [];
  listaEntregadores: Array<{ id: number; nome: string }> = [];
  listaResponsaveisRota: Array<{ id: number; nome: string }> = [];
  clientes: Cliente[] = [];
  transportes: Transporte[] = [];
  ajudantes: Ajudante[] = [];
  motoristas: Motorista[] = [];
  agregados: Agregado[] = [];
  ajudantesSelecionadosTexto: string[] = [];
  ajudantesSelecionadosIds: number[] = [];
  rotaEditandoId?: number;
  notaEditandoId?: number;

  constructor(
    private fb: FormBuilder,
    private service: NotaService,
    private rotaService: RotaService,
    private motoristaService: MotoristaService,
    private agregadoService: AgregadoService,
    private clienteService: ClienteService,
    private transporteService: TransporteService,
    private ajudanteService: AjudanteService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      origem: ['', Validators.required],
      destino: ['', Validators.required],
      tipoResponsavel: ['motorista', Validators.required],
      idResponsavel: ['', Validators.required],
      nomeResponsavel: [''],
      distanciaKm: [''],
      tempoEstimadoMinutos: [''],
      coordenadasOrigem: [''],
      coordenadasDestino: [''],
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
      idCliente: ['', Validators.required],
      nomeCliente: [''],
      tipoColetador: ['motorista', Validators.required],
      idColetador: ['', Validators.required],
      nomeColetador: [''],
      tipoEntregador: [''],
      idEntregador: [''],
      nomeEntregador: [''],
      idVeiculo: ['', Validators.required],
      nomeVeiculo: [''],
      placaVeiculo: [''],
    });

    this.form.get('cnpjdestNota')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraCNPJ(value);
        if (formatted !== value) {
          this.form.get('cnpjdestNota')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : undefined;

    const carregamentos: Record<string, any> = {
      motoristas: this.motoristaService.listarTodos(),
      agregados: this.agregadoService.listarTodos(),
      clientes: this.clienteService.listarTodos(),
      transportes: this.transporteService.listarTodos(),
      ajudantes: this.ajudanteService.listarTodos()
    };

    if (this.id) {
      this.isEdit = true;
      carregamentos['rota'] = this.rotaService.buscarPorId(this.id);
    }

    forkJoin(carregamentos).subscribe({
      next: (result: any) => {
        this.motoristas = result.motoristas || [];
        this.agregados = result.agregados || [];
        this.clientes = result.clientes || [];
        this.transportes = result.transportes || [];
        this.ajudantes = result.ajudantes || [];

        if (result.rota) {
          this.rotaEditandoId = result.rota.idRota;
          this.notaEditandoId = result.rota.idNota;
          this.preencherFormulario(result.rota as Rota);
          this.onTipoResponsavelChange(true);
          if (result.rota.idNota) {
            this.service.buscarPorId(result.rota.idNota).subscribe({
              next: nota => this.preencherNotaFormulario(nota),
              error: () => undefined
            });
          }
        }

        this.onTipoColetadorChange(true);
        this.onTipoEntregadorChange(true);
        this.onTipoResponsavelChange(true);
      },
      error: () => {
        alert('Erro ao carregar os dados iniciais do formulário.');
      }
    });
  }

  preencherFormulario(rota: Rota): void {
    const ajudantesSelecionados = (rota.ajudantes || [])
      .map((ajudante: any) => ajudante.idAjuda ?? ajudante.id)
      .filter((id: number | undefined) => id != null);

    this.form.patchValue({
      ...rota,
      ajudantesSelecionados
    });

    this.ajudantesSelecionadosIds = ajudantesSelecionados as number[];
    this.ajudantesSelecionadosTexto = (rota.ajudantes || [])
      .map((ajudante: any) => ajudante.nomeAjuda ?? ajudante.nome ?? '')
      .filter((nome: string) => !!nome);
  }

  preencherNotaFormulario(nota: Nota): void {
    this.form.patchValue({
      numeroNota: nota.numeroNota,
      qtdNota: nota.qtdNota,
      razaosocialdestNota: nota.razaosocialdestNota,
      cidadedestNota: nota.cidadedestNota,
      cnpjdestNota: nota.cnpjdestNota,
      datacoletaNota: nota.datacoletaNota,
      dataentregaNota: nota.dataentregaNota,
      clienteNota: nota.clienteNota,
      idCliente: nota.idCliente,
      nomeCliente: nota.nomeCliente,
      tipoColetador: nota.tipoColetador || 'motorista',
      idColetador: nota.idColetador,
      nomeColetador: nota.nomeColetador,
      tipoEntregador: nota.tipoEntregador,
      idEntregador: nota.idEntregador,
      nomeEntregador: nota.nomeEntregador,
      idVeiculo: nota.idVeiculo,
      nomeVeiculo: nota.nomeVeiculo,
      placaVeiculo: nota.placaVeiculo
    });

    this.ajudantesSelecionadosIds = (nota.ajudantes || [])
      .map((ajudante: any) => ajudante.idAjuda ?? ajudante.id)
      .filter((id: number | undefined) => id != null) as number[];
    this.ajudantesSelecionadosTexto = (nota.ajudantes || [])
      .map((ajudante: any) => ajudante.nomeAjuda ?? ajudante.nome ?? '')
      .filter((nome: string) => !!nome);
  }

  getResponsaveis(tipo: string): Array<{ id: number; nome: string }> {
    if (tipo === 'agregado') {
      return this.agregados.map(agregado => ({ id: agregado.idAgre!, nome: agregado.nomeAgre }));
    }
    return this.motoristas.map(motorista => ({ id: motorista.idMoto!, nome: motorista.nomeMoto }));
  }

  onTipoColetadorChange(manterSelecao = false): void {
    const tipo = this.form.get('tipoColetador')?.value;
    this.listaColetadores = this.getResponsaveis(tipo);
    if (!manterSelecao) {
      this.form.patchValue({ idColetador: '', nomeColetador: '', coletadoporNota: '' });
    }
  }

  onTipoResponsavelChange(manterSelecao = false): void {
    const tipo = this.form.get('tipoResponsavel')?.value;
    this.listaResponsaveisRota = this.getResponsaveis(tipo);
    if (!manterSelecao) {
      this.form.patchValue({ idResponsavel: '', nomeResponsavel: '' });
    }
  }

  onResponsavelRotaChange(): void {
    const id = this.form.get('idResponsavel')?.value;
    const responsavel = this.listaResponsaveisRota.find(r => r.id == id);
    if (responsavel) {
      this.form.patchValue({ nomeResponsavel: responsavel.nome });
    }
  }

  onColetadorChange(): void {
    const id = this.form.get('idColetador')?.value;
    const responsavel = this.listaColetadores.find(r => r.id == id);
    if (responsavel) {
      this.form.patchValue({
        nomeColetador: responsavel.nome,
        coletadoporNota: responsavel.nome
      });
    }
  }

  onTipoEntregadorChange(manterSelecao = false): void {
    const tipo = this.form.get('tipoEntregador')?.value;
    this.listaEntregadores = tipo ? this.getResponsaveis(tipo) : [];
    if (!manterSelecao) {
      this.form.patchValue({ idEntregador: '', nomeEntregador: '', entregueporNota: '' });
    }
  }

  onEntregadorChange(): void {
    const id = this.form.get('idEntregador')?.value;
    const responsavel = this.listaEntregadores.find(r => r.id == id);
    if (responsavel) {
      this.form.patchValue({
        nomeEntregador: responsavel.nome,
        entregueporNota: responsavel.nome
      });
    }
  }

  onClienteChange(): void {
    const id = this.form.get('idCliente')?.value;
    const cliente = this.clientes.find(item => item.idCliente == id);
    if (cliente) {
      const nomeCliente = cliente.razaosocialCliente;
      this.form.patchValue({
        nomeCliente,
        clienteNota: nomeCliente
      });
    }
  }

  onVeiculoChange(): void {
    const id = this.form.get('idVeiculo')?.value;
    const veiculo = this.transportes.find(item => item.idTrans == id);
    if (veiculo) {
      this.form.patchValue({
        nomeVeiculo: veiculo.nomeTrans,
        placaVeiculo: veiculo.placaTrans
      });
    }
  }

  toggleAjudante(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.ajudantesSelecionadosIds.includes(id)) {
        this.ajudantesSelecionadosIds = [...this.ajudantesSelecionadosIds, id];
      }
    } else {
      this.ajudantesSelecionadosIds = this.ajudantesSelecionadosIds.filter(item => item !== id);
    }

    this.ajudantesSelecionadosTexto = this.ajudantesSelecionadosIds
      .map(ajudanteId => this.ajudantes.find(ajudante => ajudante.idAjuda == ajudanteId))
      .filter((ajudante): ajudante is Ajudante => !!ajudante)
      .map(ajudante => ajudante.nomeAjuda);
  }

  abrirCadastro(caminho: string): void {
    this.router.navigate([caminho]);
  }

  aplicarMascaraCNPJ(value: string): string {
    const numeros = value.replace(/\D/g, '').substring(0, 14);
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/-$/, '');
    }
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5').replace(/-$/, '');
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const ajudantesSelecionados = this.ajudantesSelecionadosIds.map(id => ({ idAjuda: id }));
    const notaPayload: any = {
      numeroNota: this.form.value.numeroNota,
      qtdNota: this.form.value.qtdNota,
      razaosocialdestNota: this.form.value.razaosocialdestNota,
      cidadedestNota: this.form.value.cidadedestNota,
      cnpjdestNota: this.form.value.cnpjdestNota,
      datacoletaNota: this.form.value.datacoletaNota,
      dataentregaNota: this.form.value.dataentregaNota,
      clienteNota: this.form.value.clienteNota,
      idCliente: this.form.value.idCliente,
      nomeCliente: this.form.value.nomeCliente,
      tipoColetador: this.form.value.tipoColetador,
      idColetador: this.form.value.idColetador,
      nomeColetador: this.form.value.nomeColetador,
      tipoEntregador: this.form.value.tipoEntregador,
      idEntregador: this.form.value.idEntregador,
      nomeEntregador: this.form.value.nomeEntregador,
      idVeiculo: this.form.value.idVeiculo,
      nomeVeiculo: this.form.value.nomeVeiculo,
      placaVeiculo: this.form.value.placaVeiculo,
      ajudantes: ajudantesSelecionados
    };

    const salvarNota = this.isEdit && this.notaEditandoId
      ? this.service.atualizar(this.notaEditandoId, notaPayload)
      : this.service.criar(notaPayload);

    salvarNota.subscribe({
      next: (notaSalva: any) => {
        const notaId = notaSalva?.idNota || this.notaEditandoId;
        const rotaPayload: any = {
          origem: this.form.value.origem,
          destino: this.form.value.destino,
          tipoResponsavel: this.form.value.tipoResponsavel,
          idResponsavel: this.form.value.idResponsavel,
          nomeResponsavel: this.form.value.nomeResponsavel,
          distanciaKm: this.form.value.distanciaKm,
          tempoEstimadoMinutos: this.form.value.tempoEstimadoMinutos,
          coordenadasOrigem: this.form.value.coordenadasOrigem,
          coordenadasDestino: this.form.value.coordenadasDestino,
          idNota: notaId,
          numeroNota: this.form.value.numeroNota,
          clienteNota: this.form.value.clienteNota,
          idCliente: this.form.value.idCliente,
          nomeCliente: this.form.value.nomeCliente,
          idVeiculo: this.form.value.idVeiculo,
          nomeVeiculo: this.form.value.nomeVeiculo,
          placaVeiculo: this.form.value.placaVeiculo,
          ajudantes: ajudantesSelecionados
        };

        const salvarRota = this.isEdit && this.rotaEditandoId
          ? this.rotaService.atualizar(this.rotaEditandoId, rotaPayload)
          : this.rotaService.criar(rotaPayload);

        salvarRota.subscribe({
          next: () => {
            alert('Rota e nota salvas com sucesso!');
            this.router.navigate(['/rotas']);
          },
          error: (error) => {
            console.error('Erro ao salvar rota:', error);
            alert(error.error?.message || 'Erro ao salvar rota');
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Erro ao salvar nota:', error);
        alert(error.error?.message || 'Erro ao salvar nota');
        this.loading = false;
      }
    });
  }
}
