import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-footer-arrendatario',
  templateUrl: './footer-arrendatario.component.html',
  styleUrl: './footer-arrendatario.component.css'
})
export class FooterArrendatarioComponent implements OnInit {
  idArrendatario!: number; // Se obtiene de la URL
  ip: string = 'localhost'; // IP del servidor backend

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authGuardService: AuthGuardService // Inyectar el servicio AuthGuard
  ) {}

  ngOnInit() {
    // Usar el servicio AuthGuard para verificar la autenticación
    this.authGuardService.checkAuthentication();

    // Si pasa la autenticación, obtener el id del arrendatario desde la ruta (URL)
    this.idArrendatario = +this.route.snapshot.paramMap.get('idArrendatario')!;
  }

  // Métodos de navegación a otras vistas
  navigateToVerContratos() {
    this.router.navigate([`/arrendatario/${this.idArrendatario}/contratos`]);
  }

  navigateToCalificar() {
    this.router.navigate([`/arrendatario/${this.idArrendatario}/calificar`]);
  }

  navigateToPrincipal() {
    this.router.navigate([`/arrendatario/${this.idArrendatario}`]);
  }

  // Método para cerrar sesión
  logout() {
    this.authGuardService.logout(); // Usar el método logout del servicio AuthGuard
    alert('Sesión cerrada exitosamente.');
  }
}
