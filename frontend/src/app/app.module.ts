import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    MotoristaListComponent,
    MotoristaFormComponent,
    AgregadoListComponent,
    AgregadoFormComponent,
    AjudanteListComponent,
    AjudanteFormComponent,
    ClienteListComponent,
    ClienteFormComponent,
    TransporteListComponent,
    TransporteFormComponent,
    NotaListComponent,
    NotaFormComponent,
    RotaListComponent,
    RotaFormComponent,
    CadastroComponent,
    RecuperarSenhaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
