import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rota } from '../models/rota.model';

@Injectable({
  providedIn: 'root'
})
export class RotaService {
  private apiUrl = `${environment.apiUrl}/rotas`;

  constructor(private http: HttpClient) {}

  listarTodas(pesquisa?: string): Observable<Rota[]> {
    let params = new HttpParams();
    if (pesquisa) {
      params = params.set('pesquisa', pesquisa);
    }
    return this.http.get<Rota[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Rota> {
    return this.http.get<Rota>(`${this.apiUrl}/${id}`);
  }

  criar(rota: Rota): Observable<Rota> {
    return this.http.post<Rota>(this.apiUrl, rota);
  }

  atualizar(id: number, rota: Rota): Observable<Rota> {
    return this.http.put<Rota>(`${this.apiUrl}/${id}`, rota);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
