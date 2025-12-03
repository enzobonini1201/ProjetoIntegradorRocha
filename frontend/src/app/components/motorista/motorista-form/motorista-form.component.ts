import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotoristaService } from '../../../services/motorista.service';
import { Motorista } from '../../../models/motorista.model';

@Component({
  selector: 'app-motorista-form',
  templateUrl: './motorista-form.component.html',
  styleUrls: ['./motorista-form.component.css']
})
export class MotoristaFormComponent implements OnInit {
  motoristaForm!: FormGroup;
  isEditMode: boolean = false;
  motoristaId?: number;
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private motoristaService: MotoristaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.motoristaForm = this.formBuilder.group({
      nomeMoto: ['', Validators.required],
      telefoneMoto: ['', Validators.required],
      datanascMoto: ['', Validators.required],
      cpfMoto: ['', Validators.required],
      enderecoMoto: ['', Validators.required],
      buonnyMoto: ['', Validators.required],
      cnhMoto: ['', Validators.required]
    });

    // Adicionar máscara de telefone
    this.motoristaForm.get('telefoneMoto')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraTelefone(value);
        if (formatted !== value) {
          this.motoristaForm.get('telefoneMoto')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    // Adicionar máscara de CPF
    this.motoristaForm.get('cpfMoto')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraCPF(value);
        if (formatted !== value) {
          this.motoristaForm.get('cpfMoto')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.motoristaId = +id;
      this.carregarMotorista(this.motoristaId);
    }
  }

  get f() {
    return this.motoristaForm.controls;
  }

  carregarMotorista(id: number): void {
    this.loading = true;
    this.motoristaService.buscarPorId(id)
      .subscribe({
        next: (motorista) => {
          this.motoristaForm.patchValue(motorista);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar motorista:', error);
          alert('Erro ao carregar motorista');
          this.voltar();
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.motoristaForm.invalid) {
      return;
    }

    this.loading = true;
    const motorista: Motorista = this.motoristaForm.value;

    const operacao = this.isEditMode
      ? this.motoristaService.atualizar(this.motoristaId!, motorista)
      : this.motoristaService.criar(motorista);

    operacao.subscribe({
      next: () => {
        alert(`Motorista ${this.isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
        this.voltar();
      },
      error: (error) => {
        console.error('Erro ao salvar motorista:', error);
        alert('Erro ao salvar motorista');
        this.loading = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/motoristas']);
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
