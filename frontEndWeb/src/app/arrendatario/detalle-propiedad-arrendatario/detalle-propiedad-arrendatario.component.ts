import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../../services/propiedades.service';
import { Propiedad } from '../../interfaces/propiedad.interface';

@Component({
  selector: 'app-detalle-propiedad-arrendatario',
  templateUrl: './detalle-propiedad-arrendatario.component.html',
  styleUrls: ['./detalle-propiedad-arrendatario.component.css'],
})
export class DetallePropiedadArrendatarioComponent implements OnInit {
  propiedad!: Propiedad;
  idPropiedad!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute, // Inyección del servicio ActivatedRoute
    private propiedadesService: PropiedadesService
  ) {}

  ngOnInit(): void {
    // Validar la existencia del token JWT
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    // Obtener el ID de la propiedad desde la URL
    const propiedadId = this.route.snapshot.paramMap.get('idPropiedad');
    if (propiedadId) {
      this.idPropiedad = +propiedadId;
      this.cargarPropiedad();
    } else {
      console.error('ID de propiedad no encontrado en la ruta');
      this.router.navigate(['/arrendatario']);
    }
  }

  cargarPropiedad(): void {
    this.propiedadesService.getPropiedad(this.idPropiedad).subscribe(
      (propiedad) => {
        this.propiedad = propiedad;
        console.log('Propiedad cargada:', propiedad);
      },
      (error) => {
        console.error('Error al cargar la propiedad:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        } else {
          alert('Error al cargar la propiedad. Intente más tarde.');
        }
      }
    );
  }

  redirigirSolicitarArriendo(): void {
    if (this.propiedad?.idArrendador) {
      console.log(
        `Redirigiendo a solicitar arriendo con idPropiedad: ${this.idPropiedad} y idArrendador: ${this.propiedad.idArrendador}`
      );
      this.router.navigate([`/arrendatario/solicitar-arriendo/${this.idPropiedad}/${this.propiedad.idArrendador}`]);
    } else {
      console.error('No se puede redirigir: idArrendador no definido en la propiedad.');
    }
  }

  getImagenUrl(url: string | null): string {
    return url ?? '../../../assets/images/finca.webp';
  }

  // Métodos de navegación a otras vistas
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
