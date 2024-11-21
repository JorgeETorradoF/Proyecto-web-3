import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  redirectUrl: string;
  userToken: string; // Token JWT
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private ip: string = 'localhost';
  private readonly TOKEN_KEY = 'authToken'; // Clave para guardar el token en localStorage

  constructor(private http: HttpClient) {}

  setIp(ip: string): void {
    this.ip = ip;
  }

  // Método para realizar el login
  login(data: { correo: string; contraseña: string }): Observable<LoginResponse> {
    const url = `http://${this.ip}/api/iniciar-sesion`;
    return this.http.post<LoginResponse>(url, data);
  }

  // Guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Decodificar el token JWT
  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Verificar si el usuario es arrendador
  isArrendador(): boolean {
    const decodedToken = this.decodeToken();
    return decodedToken?.rol === 'ARRENDADOR';
  }

  // Verificar si el usuario es arrendatario
  isArrendatario(): boolean {
    const decodedToken = this.decodeToken();
    return decodedToken?.rol === 'ARRENDATARIO';
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Eliminar el token (Cerrar sesión)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Crear headers con el token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
