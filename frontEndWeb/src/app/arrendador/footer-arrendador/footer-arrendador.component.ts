import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-footer-arrendador',
  templateUrl: './footer-arrendador.component.html',
  styleUrls: ['./footer-arrendador.component.css'],
})
export class FooterArrendadorComponent implements OnInit {
  constructor(
    private router: Router,
    private authGuardService: AuthGuardService // Inyectar el servicio AuthGuard
  ) {}

  ngOnInit(): void {
    // Usar el servicio AuthGuard para verificar autenticación y rol
    this.authGuardService.checkAuthenticationAndRole('ARRENDADOR');
  }

  navigateToCalificar() {
    this.router.navigate(['/arrendador/calificar']);
  }

  navigateToVerContratos() {
    this.router.navigate(['/arrendador/contratos']);
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
