import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  readonly TOKEN_KEY = 'authToken'; // Clave para el token en localStorage

  constructor(private router: Router) {}

  // Getter para exponer el TOKEN_KEY de forma controlada
  get tokenKey(): string {
    return this.TOKEN_KEY;
  }

  // Verifica si el usuario está autenticado verificando si el token existe en localStorage
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token; // Retorna true si el token existe, false en caso contrario
  }

  // Valida la autenticación y redirige al login si no hay token
  checkAuthentication(): void {
    if (!this.isAuthenticated()) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
    }
  }

  // Método para cerrar sesión eliminando el token de localStorage
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY); // Eliminar el token del almacenamiento local
    console.info('Sesión cerrada exitosamente. Redirigiendo a inicio de sesión.');
    this.router.navigate(['/login']); // Redirigir al login
  }
}
