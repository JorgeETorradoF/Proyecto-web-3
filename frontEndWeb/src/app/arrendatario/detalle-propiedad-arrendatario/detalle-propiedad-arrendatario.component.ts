import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../../services/propiedades.service';

interface Propiedad {
  id: number;
  nombrePropiedad: string;
  descripcion: string;
  valorNoche: number;
  departamento: string;
  municipio: string;
  tipoIngreso: string;
  cantidadHabitaciones: number;
  cantidadBanos: number;
  permiteMascotas: boolean;
  tienePiscina: boolean;
  tieneAsador: boolean;
  urlImagen: string | null;
  idArrendador?: number;
}

@Component({
  selector: 'app-detalle-propiedad-arrendatario',
  templateUrl: './detalle-propiedad-arrendatario.component.html',
  styleUrls: ['./detalle-propiedad-arrendatario.component.css'],
})
export class DetallePropiedadArrendatarioComponent implements OnInit {
  propiedad!: Propiedad;
  idPropiedad!: number;
  idArrendatario: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propiedadesService: PropiedadesService
  ) {}

  ngOnInit(): void {
    // Validar token JWT
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    // Obtener ID de arrendatario y propiedad de la URL
    this.idArrendatario = +this.route.snapshot.paramMap.get('idArrendatario')!;
    const propiedadId = this.route.snapshot.paramMap.get('idPropiedad');
    if (propiedadId) {
      this.idPropiedad = +propiedadId;
      this.cargarPropiedad();
    } else {
      console.error('ID de propiedad no encontrado en la ruta');
    }
  }

  cargarPropiedad(): void {
    this.propiedadesService.getPropiedad(1, this.idPropiedad).subscribe(
      (propiedad) => {
        this.propiedad = propiedad;
        console.log('Propiedad cargada:', propiedad);
      },
      (error) => {
        console.error('Error al cargar la propiedad:', error);
      }
    );
  }

  redirigirSolicitarArriendo(idArrendador: number): void {
    console.log(
      `Redirigiendo a solicitar arriendo con idArrendador: ${idArrendador} y idPropiedad: ${this.idPropiedad}`
    );
    this.router.navigate([
      `/arrendatario/${this.idArrendatario}/solicitar-arriendo/${this.idPropiedad}/${idArrendador}`,
    ]);
  }

  getImagenUrl(url: string | null): string {
    return url ?? '../../../assets/images/finca.webp';
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
