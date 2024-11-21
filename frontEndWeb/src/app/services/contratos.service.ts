import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Contract {
  fechaInicio: string;
  fechaFinal: string;
  id: number;
  idPropiedad: number;
  idArrendatario: number;
  estado: number;
  precio: number;
}
interface Solicitud {
  fechaInicio: string;
  fechaFinal: string;
  cantidadPersonas: number;
  enConflicto: boolean;
}

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

  // Obtener contratos del arrendador
  getContratosArrendador(): Observable<Contract[]> {
    const url = `${this.baseUrl}/arrendador/mis-contratos`;
    return this.http.get<Contract[]>(url, { headers: this.getHeaders() });
  }

  // Aceptar contrato
  aceptarContrato(idContrato: number): Observable<any> {
    const url = `${this.baseUrl}/arrendador/aceptar-contrato/${idContrato}`;
    return this.http.put<any>(url, {}, { headers: this.getHeaders() });
  }

  // Rechazar contrato
  rechazarContrato(idContrato: number): Observable<any> {
    const url = `${this.baseUrl}/arrendador/rechazar-contrato/${idContrato}`;
    return this.http.put<any>(url, {}, { headers: this.getHeaders() });
  }

  // Obtener contratos del arrendatario
  getContratosArrendatario(): Observable<Contract[]> {
    const url = `${this.baseUrl}/arrendatario/mis-contratos`;
    return this.http.get<Contract[]>(url, { headers: this.getHeaders() });
  }

  // Solicitar arriendo
  solicitarArriendo(idPropiedad: number, solicitud: Solicitud): Observable<any> {
    const url = `${this.baseUrl}/arrendatario/solicitar-arriendo/${idPropiedad}`;
    return this.http.post<any>(url, solicitud, { headers: this.getHeaders() });
  }
}
