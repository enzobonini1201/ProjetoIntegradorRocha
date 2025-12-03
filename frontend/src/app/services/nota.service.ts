import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Nota } from '../models/nota.model';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private apiUrl = `${environment.apiUrl}/notas`;

  constructor(private http: HttpClient) {}

  listarTodas(pesquisa?: string): Observable<Nota[]> {
    let params = new HttpParams();
    if (pesquisa) {
      params = params.set('pesquisa', pesquisa);
    }
    return this.http.get<Nota[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Nota> {
    return this.http.get<Nota>(`${this.apiUrl}/${id}`);
  }

  criar(nota: Nota): Observable<Nota> {
    return this.http.post<Nota>(this.apiUrl, nota);
  }

  atualizar(id: number, nota: Nota): Observable<Nota> {
    return this.http.put<Nota>(`${this.apiUrl}/${id}`, nota);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  listarPendentes(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/pendentes`);
  }
}
