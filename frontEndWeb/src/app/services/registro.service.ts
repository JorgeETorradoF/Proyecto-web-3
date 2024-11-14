import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private ip: string = 'localhost'; // IP por defecto

  constructor(private http: HttpClient) {}

  // Método para configurar la IP del servidor backend
  setIp(ip: string): void {
    this.ip = ip;
  }

  // Método para obtener los headers con el token JWT (opcional si se requiere autenticación)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtén el token del almacenamiento local
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agrega el token en el header Authorization
    });
  }

  // Método para registrar un nuevo usuario
  register(data: { nombre: string; apellido: string; correo: string; contraseña: string; arrendador: boolean }): Observable<any> {
    const url = `http://${this.ip}/api/crear-cuenta`;
    return this.http.post(url, data); // El registro no requiere el token, así que no se incluyen headers aquí
  }
}
