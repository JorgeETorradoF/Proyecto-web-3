import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propiedad } from '../interfaces/propiedad.interface';

@Injectable({
  providedIn: 'root',
})
export class PropiedadesService {
  private baseUrl: string = 'http://localhost/api'; // Inicialmente vacío

  constructor(private http: HttpClient) {}

  // Método para configurar la IP del servidor backend
  setIp(ip: string) {
    this.baseUrl = `http://${ip}/api`;
  }

  // Método para obtener headers con el token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtener el token almacenado
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agregar el token al encabezado Authorization
    });
  }

  // Obtener todas las propiedades (sin autenticación, ejemplo público)
  getAllPropiedades(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.baseUrl}/get-propiedades`);
  }

  // Obtener propiedades de un arrendador
  getPropiedadesArrendador(idArrendador: number): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(
      `${this.baseUrl}/arrendador/${idArrendador}/propiedades`,
      { headers: this.getHeaders() }
    );
  }

  // Crear nueva propiedad sin imagen
  crearPropiedad(idArrendador: number, propiedad: Propiedad): Observable<Propiedad> {
    return this.http.post<Propiedad>(
      `${this.baseUrl}/arrendador/${idArrendador}/registrar-propiedad`,
      propiedad,
      { headers: this.getHeaders() }
    );
  }

  // Crear propiedad con imagen
  crearPropiedadConImagen(idArrendador: number, formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/arrendador/${idArrendador}/registrar-propiedad`;
    return this.http.post(url, formData, { headers: this.getHeaders() });
  }

  // Obtener detalles de una propiedad específica
  getPropiedad(idArrendador: number, idPropiedad: number): Observable<Propiedad> {
    const url = `${this.baseUrl}/arrendador/${idArrendador}/propiedad/${idPropiedad}`;
    return this.http.get<Propiedad>(url, { headers: this.getHeaders() });
  }

  // Editar propiedad
  editarPropiedad(idArrendador: number, idPropiedad: number, propiedad: any): Observable<any> {
    const url = `${this.baseUrl}/arrendador/${idArrendador}/modificar-propiedad/${idPropiedad}`;
    return this.http.put(url, propiedad, { headers: this.getHeaders() });
  }

  // Eliminar propiedad
  eliminarPropiedad(idPropiedad: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/propiedades/${idPropiedad}`, {
      headers: this.getHeaders(),
    });
  }

  // Propiedad.service.ts
  obtenerPropiedad(idArrendador: number, idPropiedad: number): Observable<any> {
    const url = `${this.baseUrl}/arrendador/${idArrendador}/propiedad/${idPropiedad}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}
