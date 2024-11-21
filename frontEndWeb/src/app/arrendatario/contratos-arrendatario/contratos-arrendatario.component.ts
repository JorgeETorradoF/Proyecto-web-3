import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratosService } from '../../services/contratos.service'; // Importa el servicio
import { Contract } from '../../interfaces/contrato.interface';

@Component({
  selector: 'app-contratos-arrendatario',
  templateUrl: './contratos-arrendatario.component.html',
  styleUrls: ['./contratos-arrendatario.component.css']
})
export class ContratosArrendatarioComponent implements OnInit {
  contratos: Contract[] = []; // Array para almacenar los contratos

  constructor(
    private router: Router,
    private contratosService: ContratosService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']); // Redirigir al inicio de sesión si no hay token
      return;
    }

    this.obtenerContratos(); // Llamar al método para obtener los contratos
  }

  // Método para obtener los contratos del arrendatario desde el servicio
  obtenerContratos(): void {
    this.contratosService.getContratosArrendatario().subscribe(
      (data) => {
        console.log('Contratos obtenidos:', data);
        this.contratos = data; // Asignar los contratos obtenidos a la variable
      },
      (error) => {
        console.error('Error al obtener contratos:', error); // Manejo de errores
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken'); // Eliminar token inválido
          this.router.navigate(['/login']); // Redirigir al inicio de sesión
        }
      }
    );
  }

  // Método para obtener el estado del contrato en un formato legible
  getEstadoContrato(estado: number): string {
    switch (estado) {
      case 1:
        return 'Aceptado';
      case -1:
        return 'Rechazado';
      case 0:
        return 'Pendiente';
      default:
        return 'Desconocido'; // Fallback para estados inesperados
    }
  }

   // Métodos de navegación a otras vistas
   navigateToVerContratos(): void {
    this.router.navigate(['/arrendatario/contratos']);
  }
  // Métodos de navegación a otras vistas
  navigateToCalificar(): void {
    this.router.navigate(['/arrendatario/calificar']); // Redirigir a la vista de calificación
  }

  navigateToPrincipal(): void {
    this.router.navigate(['/arrendatario']); // Redirigir a la vista principal del arrendatario
  }
}
