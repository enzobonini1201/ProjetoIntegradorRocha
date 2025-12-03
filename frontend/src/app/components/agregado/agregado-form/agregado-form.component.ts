import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgregadoService } from '../../../services/agregado.service';

@Component({
  selector: 'app-agregado-form',
  templateUrl: './agregado-form.component.html',
  styleUrls: ['./agregado-form.component.css']
})
export class AgregadoFormComponent implements OnInit {
  agregadoForm!: FormGroup;
  isEditMode = false;
  agregadoId?: number;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private agregadoService: AgregadoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.agregadoForm = this.fb.group({
      nomeAgre: ['', Validators.required],
      telefoneAgre: ['', Validators.required],
      datanascAgre: ['', Validators.required],
      cpfAgre: ['', Validators.required],
      enderecoAgre: ['', Validators.required],
      buonnyAgre: ['', Validators.required],
      cnhAgre: ['', Validators.required]
    });

    // Adicionar máscara de telefone
    this.agregadoForm.get('telefoneAgre')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraTelefone(value);
        if (formatted !== value) {
          this.agregadoForm.get('telefoneAgre')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    // Adicionar máscara de CPF
    this.agregadoForm.get('cpfAgre')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = this.aplicarMascaraCPF(value);
        if (formatted !== value) {
          this.agregadoForm.get('cpfAgre')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.agregadoId = +id;
      this.carregarAgregado(this.agregadoId);
    }
  }

  get f() { return this.agregadoForm.controls; }

  carregarAgregado(id: number): void {
    this.agregadoService.buscarPorId(id).subscribe({
      next: (data) => this.agregadoForm.patchValue(data),
      error: () => this.voltar()
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.agregadoForm.invalid) return;

    this.loading = true;
    const formData = this.agregadoForm.value;
    console.log('Enviando dados:', formData);
    
    const op = this.isEditMode 
      ? this.agregadoService.atualizar(this.agregadoId!, formData)
      : this.agregadoService.criar(formData);

    op.subscribe({
      next: () => {
        alert('Agregado salvo com sucesso!');
        this.voltar();
      },
      error: (error) => {
        console.error('Erro ao salvar agregado:', error);
        if (error.status !== 401 && error.status !== 403) {
          let mensagem = 'Erro ao salvar agregado';
          if (error.status === 400) {
            mensagem = 'Dados inválidos. Verifique os campos.';
          } else if (error.error?.message) {
            mensagem = error.error.message;
          }
          alert(mensagem);
        }
        this.loading = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/agregados']);
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
