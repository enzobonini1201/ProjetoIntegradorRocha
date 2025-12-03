import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ajudante } from '../models/ajudante.model';

@Injectable({
  providedIn: 'root'
})
export class AjudanteService {
  private apiUrl = `${environment.apiUrl}/ajudantes`;

  constructor(private http: HttpClient) {}

  listarTodos(pesquisa?: string): Observable<Ajudante[]> {
    let params = new HttpParams();
    if (pesquisa) {
      params = params.set('pesquisa', pesquisa);
    }
    return this.http.get<Ajudante[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Ajudante> {
    return this.http.get<Ajudante>(`${this.apiUrl}/${id}`);
  }

  criar(ajudante: Ajudante): Observable<Ajudante> {
    return this.http.post<Ajudante>(this.apiUrl, ajudante);
  }

  atualizar(id: number, ajudante: Ajudante): Observable<Ajudante> {
    return this.http.put<Ajudante>(`${this.apiUrl}/${id}`, ajudante);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
