import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    
    console.log('Interceptor - Token:', token ? 'Presente' : 'Ausente');
    console.log('Interceptor - URL:', request.url);
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro na requisição:', error.status, error.message);
        if (error.status === 401 || error.status === 403) {
          console.warn('Token inválido ou expirado. Redirecionando para login...');
          this.authService.logout();
          alert('Sua sessão expirou. Faça login novamente.');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
