import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar *ngIf="showNavbar()"></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'Sistema Rocha Transportes';

  showNavbar(): boolean {
    const path = window.location.pathname;
    return !path.includes('/login') && !path.includes('/cadastro') && !path.includes('/recuperar-senha');
  }
}
