import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transporte } from '../models/transporte.model';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {
  private apiUrl = `${environment.apiUrl}/transportes`;

  constructor(private http: HttpClient) {}

  listarTodos(pesquisa?: string): Observable<Transporte[]> {
    let params = new HttpParams();
    if (pesquisa) {
      params = params.set('pesquisa', pesquisa);
    }
    return this.http.get<Transporte[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Transporte> {
    return this.http.get<Transporte>(`${this.apiUrl}/${id}`);
  }

  criar(transporte: Transporte): Observable<Transporte> {
    return this.http.post<Transporte>(this.apiUrl, transporte);
  }

  atualizar(id: number, transporte: Transporte): Observable<Transporte> {
    return this.http.put<Transporte>(`${this.apiUrl}/${id}`, transporte);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
