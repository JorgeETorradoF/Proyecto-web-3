import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  redirectUrl: string;
  userToken: string;       // Token JWT
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

  // Guardar el token en localStorage, que espero sea así xd
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Verificar si el usuario está autenticado (existe un token válido)
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Eliminar el token (Cerrar sesión)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
