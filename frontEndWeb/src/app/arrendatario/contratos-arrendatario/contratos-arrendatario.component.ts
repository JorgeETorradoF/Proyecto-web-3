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
  idArrendatario!: number; // ID del Arrendatario

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contratosService: ContratosService
  ) {}

  ngOnInit() {
    // Validar token JWT
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    // Obtener el ID del Arrendatario de la URL
    this.idArrendatario = +this.route.snapshot.paramMap.get('idArrendatario')!;
    console.log('ID del Arrendatario:', this.idArrendatario);
    this.obtenerContratos();
  }

  // Método para obtener los contratos del backend usando el servicio
  obtenerContratos() {
    this.contratosService.getContratosArrendatario(this.idArrendatario).subscribe(
      data => {
        console.log('Contratos obtenidos:', data); // Verifica la respuesta en la consola
        this.contratos = data; // Almacena los contratos en la propiedad
      },
      error => {
        console.error('Error al obtener contratos:', error); // imprime si llega a haber algún error
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
        return 'Desconocido'; // Siempre estará entre los 3 primeros pero el compilador jode si no hay un default :'v
    }
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
}
