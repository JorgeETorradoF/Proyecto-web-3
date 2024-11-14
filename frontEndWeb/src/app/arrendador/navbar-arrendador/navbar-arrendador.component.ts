import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-navbar-arrendador',
  templateUrl: './navbar-arrendador.component.html',
  styleUrls: ['./navbar-arrendador.component.css'],
})
export class NavbarArrendadorComponent implements OnInit {
  idArrendador!: number; // Se obtiene de la URL
  ip: string = 'localhost'; // IP del servidor backend

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authGuardService: AuthGuardService // Inyectar el servicio AuthGuard
  ) {}

  ngOnInit() {
    // Usar el servicio AuthGuard para verificar la autenticación
    this.authGuardService.checkAuthentication();

    // Si pasa la autenticación, obtener el id del arrendador desde la ruta (URL)
    this.idArrendador = +this.route.snapshot.paramMap.get('idArrendador')!;
  }

  // Métodos de navegación a otras vistas
  navigateToVerContratos() {
    this.router.navigate([`/arrendador/${this.idArrendador}/contratos`]);
  }

  navigateToCalificar() {
    this.router.navigate([`/arrendador/${this.idArrendador}/calificar`]);
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
