import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PropiedadesService } from '../../services/propiedades.service';
import { ContratosService } from '../../services/contratos.service';
import { Propiedad } from '../../interfaces/propiedad.interface';
import { Solicitud } from '../../interfaces/solicitud.interface';

@Component({
  selector: 'app-solicitar-arriendo',
  templateUrl: './solicitar-arriendo.component.html',
  styleUrls: ['./solicitar-arriendo.component.css'],
})
export class SolicitarArriendoComponent implements OnInit {
  propiedad: Propiedad | undefined;
  solicitud = {
    fechaInicio: '',
    fechaFinal: '',
    cantidadPersonas: 1,
    enConflicto: false,
  };
  errorFechas: boolean = false;
  fechaHoy: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private propiedadesService: PropiedadesService,
    private contratosService: ContratosService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken'); // Validar token JWT
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    // Inicializar fecha mínima para inputs
    this.fechaHoy = new Date().toISOString().split('T')[0];

    const propiedadId = this.route.snapshot.paramMap.get('idPropiedad');
    if (propiedadId) {
      this.propiedadesService.getPropiedad(+propiedadId).subscribe(
        (data: Propiedad) => {
          this.propiedad = data;
        },
        (error) => {
          console.error('Error al obtener la propiedad:', error);
          this.router.navigate(['/principal']);
        }
      );
    } else {
      console.error('ID de propiedad no encontrado en la ruta.');
      this.router.navigate(['/principal']);
    }
  }

  onSubmit(): void {
    if (!this.propiedad) {
      alert('Propiedad no encontrada.');
      return;
    }

    const fechaInicio = new Date(this.solicitud.fechaInicio);
    const fechaFinal = new Date(this.solicitud.fechaFinal);

    if (fechaInicio > fechaFinal) {
      alert('La fecha final debe ser posterior a la fecha de inicio.');
      return;
    }

    if (fechaInicio < new Date()) {
      alert('La fecha de inicio debe ser superior a la fecha actual.');
      return;
    }

    const solicitud: Solicitud = {
      fechaInicio: this.formatFechaISO(this.solicitud.fechaInicio),
      fechaFinal: this.formatFechaISO(this.solicitud.fechaFinal),
      cantidadPersonas: this.solicitud.cantidadPersonas,
      enConflicto: false,
    };

    this.contratosService.solicitarArriendo(this.propiedad.id, solicitud).subscribe(
      (response) => {
        console.log('Solicitud enviada:', response);
        alert('¡Solicitud enviada con éxito!');
        this.router.navigate(['/principal']);
      },
      (error) => {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud. Intente nuevamente.');
      }
    );
  }

  formatFechaISO(fecha: string): string {
    const date = new Date(fecha);
    return date.toISOString();
  }

  validarFechas(): void {
    const fechaInicio = new Date(this.solicitud.fechaInicio);
    const fechaFinal = new Date(this.solicitud.fechaFinal);

    this.errorFechas =
      fechaInicio > fechaFinal || fechaInicio < new Date(this.fechaHoy);

    if (this.errorFechas) {
      console.error('Error: Las fechas no son válidas.');
    }
  }

  navigateToVerContratos(): void {
    this.router.navigate(['/arrendatario/contratos']);
  }

  navigateToCalificar(): void {
    this.router.navigate(['/arrendatario/calificar']);
  }

  navigateToPrincipal(): void {
    this.router.navigate(['/arrendatario']);
  }
}
