import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl: string = 'http://localhost/api';

  constructor(private http: HttpClient) {}

  // Método para configurar la IP del servidor backend
  setIp(ip: string) {
    this.baseUrl = `http://${ip}/api`;
  }

  // Método para obtener los headers con el token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtén el token del almacenamiento local
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agrega el token en el header Authorization
    });
  }

  // Método para conseguir a los arrendadores
  getAllArrendadores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/get-arrendadores`, {
      headers: this.getHeaders(),
    });
  }

  // Método para conseguir a los arrendatarios
  getAllArrendatarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/get-arrendatarios`, {
      headers: this.getHeaders(),
    });
  }
}
