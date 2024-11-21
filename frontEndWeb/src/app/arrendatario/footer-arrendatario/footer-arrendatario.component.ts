import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-footer-arrendatario',
  templateUrl: './footer-arrendatario.component.html',
  styleUrls: ['./footer-arrendatario.component.css'],
})
export class FooterArrendatarioComponent implements OnInit {
  ip: string = 'localhost'; // IP del servidor backend

  constructor(
    private router: Router,
    private authGuardService: AuthGuardService // Inyectar el servicio AuthGuard
  ) {}

  ngOnInit() {
    // Usar el servicio AuthGuard para verificar autenticación y rol
    this.authGuardService.checkAuthenticationAndRole('ARRENDATARIO');
  }

  // Métodos de navegación a otras vistas
  navigateToVerContratos() {
    this.router.navigate(['/arrendatario/contratos']);
  }

  navigateToCalificar() {
    this.router.navigate(['/arrendatario/calificar']);
  }

  navigateToPrincipal() {
    this.router.navigate(['/arrendatario']);
  }

  // Método para cerrar sesión
  logout() {
    this.authGuardService.logout(); // Usar el método logout del servicio AuthGuard
    alert('Sesión cerrada exitosamente.');
  }
}
