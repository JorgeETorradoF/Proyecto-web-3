import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../interfaces/contrato.interface';
import { Solicitud } from '../interfaces/solicitud.interface';

@Injectable({
  providedIn: 'root',
})
export class ContratosService {
  private baseUrl: string = 'http://localhost/api'; // Base URL inicial

  constructor(private http: HttpClient) {}

  // Método para configurar la IP del servidor backend
  setIp(ip: string): void {
    this.baseUrl = `http://${ip}/api`; // Actualiza la base URL según la IP configurada
  }

  // Método para obtener headers con el token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtener el token almacenado en localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token al encabezado Authorization
    });
  }

  // Obtener contratos por ID de arrendador
  getContratosArrendador(idArrendador: number): Observable<Contract[]> {
    const url = `${this.baseUrl}/arrendador/${idArrendador}/mis-contratos`;
    return this.http.get<Contract[]>(url, { headers: this.getHeaders() });
  }

  // Aceptar contrato
  aceptarContrato(idArrendador: number, idContrato: number): Observable<any> {
    const url = `${this.baseUrl}/arrendador/${idArrendador}/aceptar-contrato/${idContrato}`;
    return this.http.put<any>(url, {}, { headers: this.getHeaders() });
  }

  // Rechazar contrato
  rechazarContrato(idArrendador: number, idContrato: number): Observable<any> {
    const url = `${this.baseUrl}/arrendador/${idArrendador}/rechazar-contrato/${idContrato}`;
    return this.http.put<any>(url, {}, { headers: this.getHeaders() });
  }

  // Obtener contratos por ID de arrendatario
  getContratosArrendatario(idArrendatario: number): Observable<Contract[]> {
    const url = `${this.baseUrl}/arrendatario/${idArrendatario}/mis-contratos`;
    return this.http.get<Contract[]>(url, { headers: this.getHeaders() });
  }

  // Solicitar arriendo
  solicitarArriendo(idArrendador: number, idPropiedad: number, solicitud: Solicitud): Observable<any> {
    const url = `${this.baseUrl}/arrendatario/${idArrendador}/solicitar-arriendo/${idPropiedad}`;
    return this.http.post<any>(url, solicitud, { headers: this.getHeaders() });
  }
}
