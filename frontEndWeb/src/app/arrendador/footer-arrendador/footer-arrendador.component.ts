import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-footer-arrendador',
  templateUrl: './footer-arrendador.component.html',
  styleUrls: ['./footer-arrendador.component.css']
})
export class FooterArrendadorComponent implements OnInit {
  idArrendador!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authGuardService: AuthGuardService // Inyectar el servicio AuthGuard
  ) {}

  ngOnInit(): void {
    // Usar el servicio AuthGuard para verificar la autenticación
    this.authGuardService.checkAuthentication();

    // Si pasa la autenticación, obtener el id del arrendador desde la ruta (URL)
    this.idArrendador = this.route.snapshot.paramMap.get('idArrendador')!;
    if (!this.idArrendador) {
      console.error('ID del arrendador no encontrado. Redirigiendo.');
      this.router.navigate(['/login']);
    }
  }

  navigateToCalificar() {
    this.router.navigate([`/arrendador/${this.idArrendador}/calificar`]);
  }

  navigateToVerContratos() {
    this.router.navigate([`/arrendador/${this.idArrendador}/contratos`]);
  }

  navigateToVerPropiedades() {
    this.router.navigate([`/arrendador/${this.idArrendador}/propiedades`]);
  }

  // Método para cerrar sesión
  logout() {
    this.authGuardService.logout(); // Usar el método logout del servicio AuthGuard
    alert('Sesión cerrada exitosamente.');
  }
}
