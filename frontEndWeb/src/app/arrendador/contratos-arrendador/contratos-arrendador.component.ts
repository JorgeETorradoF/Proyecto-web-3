import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratosService } from '../../services/contratos.service'; // Importa el servicio
import { Contract } from '../../interfaces/contrato.interface';

@Component({
  selector: 'app-contratos-arrendador',
  templateUrl: './contratos-arrendador.component.html',
  styleUrls: ['./contratos-arrendador.component.css']
})
export class ContratosArrendadorComponent implements OnInit {
  contratos: Contract[] = []; // Array para almacenar los contratos

  constructor(
    private router: Router,
    private contratosService: ContratosService
  ) {}

  ngOnInit() {
    // Verificar si el token está presente
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']); // Redirigir al inicio de sesión si no hay token
      return;
    }

    // Obtener los contratos del arrendador
    this.obtenerContratos();
  }

  // Método para obtener los contratos del backend usando el servicio
  obtenerContratos() {
    this.contratosService.getContratosArrendador().subscribe(
      (data) => {
        console.log('Contratos obtenidos:', data); // Verifica la respuesta en la consola
        this.contratos = data; // Almacena los contratos en la propiedad
      },
      (error) => {
        console.error('Error al obtener contratos:', error); // Imprime si llega a haber algún error
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken'); // Remover token inválido
          this.router.navigate(['/login']);
        }
      }
    );
  }

  // Método para obtener el estado del contrato en formato legible
  getEstadoContrato(estado: number): string {
    switch (estado) {
      case 1:
        return 'Aceptado';
      case -1:
        return 'Rechazado';
      case 0:
        return 'Pendiente';
      default:
        return 'Desconocido'; // Siempre estará entre los 3 primeros pero el compilador requiere un default
    }
  }

  // Método para aceptar un contrato
  aceptarContrato(id: number) {
    this.contratosService.aceptarContrato(id).subscribe(
      (response) => {
        console.log(`Contrato aceptado: ${id}`, response);
        this.obtenerContratos(); // Vuelve a cargar los contratos
      },
      (error) => {
        console.error('Error al aceptar el contrato:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken'); // Remover token inválido
          this.router.navigate(['/login']);
        }
      }
    );
  }

  // Método para rechazar un contrato
  rechazarContrato(id: number) {
    this.contratosService.rechazarContrato(id).subscribe(
      (response) => {
        console.log(`Contrato rechazado: ${id}`, response);
        this.obtenerContratos(); // Vuelve a cargar los contratos
      },
      (error) => {
        console.error('Error al rechazar el contrato:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken'); // Remover token inválido
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
