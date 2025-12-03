import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Agregado } from '../models/agregado.model';

@Injectable({
  providedIn: 'root'
})
export class AgregadoService {
  private apiUrl = `${environment.apiUrl}/agregados`;

  constructor(private http: HttpClient) {}

  listarTodos(pesquisa?: string): Observable<Agregado[]> {
    let params = new HttpParams();
    if (pesquisa) {
      params = params.set('pesquisa', pesquisa);
    }
    return this.http.get<Agregado[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Agregado> {
    return this.http.get<Agregado>(`${this.apiUrl}/${id}`);
  }

  criar(agregado: Agregado): Observable<Agregado> {
    return this.http.post<Agregado>(this.apiUrl, agregado);
  }

  atualizar(id: number, agregado: Agregado): Observable<Agregado> {
    return this.http.put<Agregado>(`${this.apiUrl}/${id}`, agregado);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
