import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalificacionService {
  private baseUrl: string = 'http://localhost/api'; // URL base inicial

  constructor(private http: HttpClient) {}

  // Método para configurar la IP del servidor backend
  setIp(ip: string): void {
    this.baseUrl = `http://${ip}/api`; // Configura la URL base según la IP proporcionada
  }

  // Método para obtener headers con el token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtener el token JWT almacenado en localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token al encabezado Authorization
    });
  }

  // Método para calificar al arrendador
  calificarArrendador(calificacion: number): Observable<any> {
    const url = `${this.baseUrl}/calificaciones/arrendador?calificacion=${calificacion}`;
    return this.http.post<any>(url, null, { headers: this.getHeaders() }); // Agregar headers con el token
  }

  // Método para calificar al arrendatario
  calificarArrendatario(calificacion: number): Observable<any> {
    const url = `${this.baseUrl}/calificaciones/arrendatario?calificacion=${calificacion}`;
    return this.http.post<any>(url, null, { headers: this.getHeaders() }); // Agregar headers con el token
  }
}
