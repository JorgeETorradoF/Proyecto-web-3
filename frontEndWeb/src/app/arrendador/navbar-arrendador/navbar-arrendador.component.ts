import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-navbar-arrendador',
  templateUrl: './navbar-arrendador.component.html',
  styleUrls: ['./navbar-arrendador.component.css'],
})
export class NavbarArrendadorComponent implements OnInit {
  ip: string = 'localhost'; // IP del servidor backend

  constructor(
    private router: Router,
    private authGuardService: AuthGuardService // Inyectar el servicio AuthGuard
  ) {}

  ngOnInit() {
    // Usar el servicio AuthGuard para verificar autenticación y rol
    this.authGuardService.checkAuthenticationAndRole('ARRENDADOR');
  }

  // Métodos de navegación a otras vistas
  navigateToVerContratos() {
    this.router.navigate(['/arrendador/contratos']);
  }

  navigateToCalificar() {
    this.router.navigate(['/arrendador/calificar']);
  }

  navigateToVerPropiedades() {
    this.router.navigate(['/arrendador/propiedades']);
  }

  // Método para cerrar sesión
  logout() {
    this.authGuardService.logout(); // Usar el método logout del servicio AuthGuard
    alert('Sesión cerrada exitosamente.');
  }
}
