import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private ip: string = 'localhost'; // IP por defecto

  constructor(private http: HttpClient) {}

  setIp(ip: string): void {
    this.ip = ip;
  }

  // Método para obtener headers con el token JWT (opcional si fuera necesario en el futuro)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtén el token almacenado en localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agrega el token al header Authorization
    });
  }

  register(data: { nombre: string; apellido: string; correo: string; contraseña: string; arrendador: boolean }): Observable<any> {
    const url = `http://${this.ip}/api/crear-cuenta`;

    // En este caso, el registro no requiere token, así que no enviamos headers personalizados
    return this.http.post(url, data);
  }
}
