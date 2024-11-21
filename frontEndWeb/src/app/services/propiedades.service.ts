import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propiedad } from '../interfaces/propiedad.interface';

@Injectable({
  providedIn: 'root',
})
export class PropiedadesService {
  private baseUrl: string = 'http://localhost/api'; // URL base del backend

  constructor(private http: HttpClient) {
    this.http = http;
  }

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
  getImagen(nombreImagen: string, headers: HttpHeaders): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/arrendador/imagenes/${nombreImagen}`, {
      headers,
      responseType: 'blob',
    });
  }
  obtenerImagen(nombreImagen: string): Observable<Blob> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/arrendador/imagenes/${nombreImagen}`, {
      headers,
      responseType: 'blob',
    });
  }

  // Obtener todas las propiedades públicas
  getAllPropiedades(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.baseUrl}/get-propiedades`);
  }

  // Obtener propiedades del arrendador autenticado
  getPropiedadesArrendador(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.baseUrl}/arrendador/propiedades`, {
      headers: this.getHeaders(),
    });
  }

  // Crear nueva propiedad sin imagen
  crearPropiedad(propiedad: Propiedad): Observable<Propiedad> {
    return this.http.post<Propiedad>(
      `${this.baseUrl}/arrendador/registrar-propiedad`,
      propiedad,
      { headers: this.getHeaders() }
    );
  }

  // Crear propiedad con imagen
  crearPropiedadConImagen(formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/arrendador/registrar-propiedad`;
    return this.http.post(url, formData, { headers: this.getHeaders() });
  }

  // Obtener detalles de una propiedad específica
  getPropiedad(idPropiedad: number): Observable<Propiedad> {
    const url = `${this.baseUrl}/arrendador/propiedad/${idPropiedad}`;
    return this.http.get<Propiedad>(url, { headers: this.getHeaders() });
  }

  // Editar propiedad
  editarPropiedad(idPropiedad: number, propiedad: any): Observable<any> {
    const url = `${this.baseUrl}/arrendador/modificar-propiedad/${idPropiedad}`;
    return this.http.put(url, propiedad, { headers: this.getHeaders() });
  }

  // Eliminar propiedad
  eliminarPropiedad(idPropiedad: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/propiedades/${idPropiedad}`, {
      headers: this.getHeaders(),
    });
  }
  obtenerPropiedad(idPropiedad: number): Observable<any> {
    const url = `${this.baseUrl}/arrendador/propiedad/${idPropiedad}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

}
