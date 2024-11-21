import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  readonly TOKEN_KEY = 'authToken'; // Clave para el token en localStorage

  constructor(private router: Router) {}

  // Verifica si el usuario está autenticado verificando si el token existe en localStorage
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token; // Retorna true si el token existe, false en caso contrario
  }

  // Obtiene el rol del usuario decodificando el token
  getUserRole(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del token
        return payload.userType || null; // Retornar el rol del usuario
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
    }
    return null;
  }

  // Valida la autenticación y redirige al login si no hay token o el rol no es válido
  checkAuthenticationAndRole(requiredRole: string): void {
    if (!this.isAuthenticated()) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    const userRole = this.getUserRole();
    if (userRole !== requiredRole) {
      console.warn(`Rol no autorizado: ${userRole}. Redirigiendo.`);
      this.router.navigate(['/']);
    }
  }

  // Método para cerrar sesión eliminando el token de localStorage
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY); // Eliminar el token del almacenamiento local
    console.info('Sesión cerrada exitosamente. Redirigiendo a inicio de sesión.');
    this.router.navigate(['/login']); // Redirigir al login
  }
}
