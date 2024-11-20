import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../../services/propiedades.service';
import { ContratosService } from '../../services/contratos.service';
import { Propiedad } from '../../interfaces/propiedad.interface';

interface Solicitud {
  fechaInicio: string;
  fechaFinal: string;
  cantidadPersonas: number;
  enConflicto: boolean;
}

@Component({
  selector: 'app-solicitar-arriendo',
  templateUrl: './solicitar-arriendo.component.html',
  styleUrls: ['./solicitar-arriendo.component.css'],
})
export class SolicitarArriendoComponent implements OnInit {
  idArrendatario: number = 0;
  propiedad: Propiedad | undefined;
  solicitud = {
    fechaInicial: '',
    fechaFinal: '',
    cantidadPersonas: 1,
    enConflicto: false,
  };
  errorFechas: boolean = false;
  fechaHoy: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propiedadesService: PropiedadesService,
    private contratosService: ContratosService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken'); // Obtener el token JWT
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    this.idArrendatario = +this.route.snapshot.paramMap.get('idArrendatario')!;
    const propiedadId = this.route.snapshot.paramMap.get('idPropiedad');
    const idArrendador = this.route.snapshot.paramMap.get('idArrendador');

    console.log(`ID de propiedad recibido: ${propiedadId}`);
    console.log(`ID de arrendador recibido: ${idArrendador}`);

    if (propiedadId && idArrendador) {
      this.propiedadesService
        .getPropiedad(parseInt(idArrendador), parseInt(propiedadId))
        .subscribe(
          (data: Propiedad) => {
            this.propiedad = data;
          },
          (error) => {
            console.error('Error al obtener la propiedad:', error);
          }
        );
    } else {
      console.error('No se encontraron los parámetros de propiedad o arrendador.');
    }
  }

  onSubmit(): void {
    console.log('Datos de la solicitud antes del envío:', this.solicitud);

    if (!this.propiedad) {
      alert('Propiedad no encontrada.');
      console.warn('No se encontró la propiedad al intentar enviar la solicitud.');
      return;
    }

    const fechaInicio = new Date(this.solicitud.fechaInicial);
    const fechaFinal = new Date(this.solicitud.fechaFinal);

    if (fechaInicio > fechaFinal) {
      alert('La fecha final debe ser posterior a la fecha de inicio.');
      console.warn('Fechas inválidas: Fecha final es anterior a la fecha de inicio.');
      return;
    }

    if (fechaInicio < new Date()) {
      alert('La fecha de inicio debe ser superior a la fecha de hoy.');
      console.warn('Fecha de inicio inválida: La fecha de inicio es anterior al día actual.');
      return;
    }

    const solicitud: Solicitud = {
      fechaInicio: this.formatFechaISO(this.solicitud.fechaInicial),
      fechaFinal: this.formatFechaISO(this.solicitud.fechaFinal),
      cantidadPersonas: this.solicitud.cantidadPersonas,
      enConflicto: false,
    };

    console.log('Solicitud preparada para enviar:', solicitud);

    const idArrendador = this.route.snapshot.paramMap.get('idArrendador');
    if (idArrendador) {
      console.log('ID de arrendador:', idArrendador, 'ID de propiedad:', this.propiedad.id);

      this.contratosService
        .solicitarArriendo(parseInt(idArrendador), this.propiedad.id, solicitud)
        .subscribe(
          (response) => {
            console.log('Respuesta del servidor:', response);
            alert('¡Solicitud enviada con éxito!');
            this.router.navigate(['/principal-arrendatario']);
          },
          (error) => {
            console.error('Error al enviar la solicitud:', error);
            alert('Error al enviar la solicitud. Intente nuevamente.');
          }
        );
    } else {
      console.warn('ID de arrendador no encontrado.');
    }
  }

  formatFechaISO(fecha: string): string {
    const date = new Date(fecha);
    const isoDate = date.toISOString();
    console.log('Fecha formateada en ISO:', isoDate);
    return isoDate;
  }

  validarFechas(): void {
    const fechaInicio = new Date(this.solicitud.fechaInicial);
    const fechaFinal = new Date(this.solicitud.fechaFinal);

    this.errorFechas =
      fechaInicio > fechaFinal || fechaInicio < new Date(this.fechaHoy);

    if (this.errorFechas) {
      console.error('Error: Las fechas no concuerdan.');
    }
  }

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
