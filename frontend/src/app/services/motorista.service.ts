import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Motorista } from '../models/motorista.model';

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private apiUrl = `${environment.apiUrl}/motoristas`;

  constructor(private http: HttpClient) {}

  listarTodos(pesquisa?: string): Observable<Motorista[]> {
    let params = new HttpParams();
    if (pesquisa) {
      params = params.set('pesquisa', pesquisa);
    }
    return this.http.get<Motorista[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Motorista> {
    return this.http.get<Motorista>(`${this.apiUrl}/${id}`);
  }

  criar(motorista: Motorista): Observable<Motorista> {
    return this.http.post<Motorista>(this.apiUrl, motorista);
  }

  atualizar(id: number, motorista: Motorista): Observable<Motorista> {
    return this.http.put<Motorista>(`${this.apiUrl}/${id}`, motorista);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
