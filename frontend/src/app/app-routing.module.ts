import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MotoristaListComponent } from './components/motorista/motorista-list/motorista-list.component';
import { MotoristaFormComponent } from './components/motorista/motorista-form/motorista-form.component';
import { AgregadoListComponent } from './components/agregado/agregado-list/agregado-list.component';
import { AgregadoFormComponent } from './components/agregado/agregado-form/agregado-form.component';
import { AjudanteListComponent } from './components/ajudante/ajudante-list/ajudante-list.component';
import { AjudanteFormComponent } from './components/ajudante/ajudante-form/ajudante-form.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import { TransporteListComponent } from './components/transporte/transporte-list/transporte-list.component';
import { TransporteFormComponent } from './components/transporte/transporte-form/transporte-form.component';
import { NotaListComponent } from './components/nota/nota-list/nota-list.component';
import { NotaFormComponent } from './components/nota/nota-form/nota-form.component';
import { RotaListComponent } from './components/rota/rota-list/rota-list.component';
import { RotaFormComponent } from './components/rota/rota-form/rota-form.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import { PerfilComponent } from './components/perfil/perfil.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  
  // Motoristas
  { path: 'motoristas', component: MotoristaListComponent, canActivate: [AuthGuard] },
  { path: 'motoristas/novo', component: MotoristaFormComponent, canActivate: [AuthGuard] },
  { path: 'motoristas/editar/:id', component: MotoristaFormComponent, canActivate: [AuthGuard] },
  
  // Agregados
  { path: 'agregados', component: AgregadoListComponent, canActivate: [AuthGuard] },
  { path: 'agregados/novo', component: AgregadoFormComponent, canActivate: [AuthGuard] },
  { path: 'agregados/editar/:id', component: AgregadoFormComponent, canActivate: [AuthGuard] },
  
  // Ajudantes
  { path: 'ajudantes', component: AjudanteListComponent, canActivate: [AuthGuard] },
  { path: 'ajudantes/novo', component: AjudanteFormComponent, canActivate: [AuthGuard] },
  { path: 'ajudantes/editar/:id', component: AjudanteFormComponent, canActivate: [AuthGuard] },
  
  // Clientes
  { path: 'clientes', component: ClienteListComponent, canActivate: [AuthGuard] },
  { path: 'clientes/novo', component: ClienteFormComponent, canActivate: [AuthGuard] },
  { path: 'clientes/editar/:id', component: ClienteFormComponent, canActivate: [AuthGuard] },
  
  // Transportes
  { path: 'transportes', component: TransporteListComponent, canActivate: [AuthGuard] },
  { path: 'transportes/novo', component: TransporteFormComponent, canActivate: [AuthGuard] },
  { path: 'transportes/editar/:id', component: TransporteFormComponent, canActivate: [AuthGuard] },
  
  // Notas
  { path: 'notas', component: NotaListComponent, canActivate: [AuthGuard] },
  { path: 'notas/novo', component: NotaFormComponent, canActivate: [AuthGuard] },
  { path: 'notas/editar/:id', component: NotaFormComponent, canActivate: [AuthGuard] },
  
  // Rotas
  { path: 'rotas', component: RotaListComponent, canActivate: [AuthGuard] },
  { path: 'rotas/novo', component: RotaFormComponent, canActivate: [AuthGuard] },
  { path: 'rotas/editar/:id', component: RotaFormComponent, canActivate: [AuthGuard] },
  
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
