import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../../../services/propiedades.service';

@Component({
  selector: 'app-detalle-propiedad',
  templateUrl: './detalle-propiedad.component.html',
  styleUrls: ['./detalle-propiedad.component.css']
})
export class DetallePropiedadComponent implements OnInit {
  propiedad: any = {};
  idArrendador!: number;
  idPropiedad!: number;
  ip: string = 'localhost';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propiedadesService: PropiedadesService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    this.idArrendador = +this.route.snapshot.paramMap.get('idArrendador')!;
    this.idPropiedad = +this.route.snapshot.paramMap.get('idPropiedad')!;

    if (this.idArrendador && this.idPropiedad) {
      this.obtenerDetallePropiedad(this.idArrendador, this.idPropiedad);
    } else {
      console.error('Error: ID del arrendador o de la propiedad no encontrado.');
      this.router.navigate(['/arrendador/1/propiedades']);
    }
  }

  obtenerDetallePropiedad(idArrendador: number, idPropiedad: number) {
    this.propiedadesService.obtenerPropiedad(idArrendador, idPropiedad).subscribe(
      (data) => {
        this.propiedad = data;
        console.log('Detalles de la propiedad:', data);
      },
      (error) => {
        console.error('Error al obtener los detalles de la propiedad:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  editarPropiedad(idPropiedad: number): void {
    this.router.navigate([`/arrendador/${this.idArrendador}/propiedades/editar-propiedad/${idPropiedad}`]);
  }

  volver(): void {
    const idArrendador = +this.route.snapshot.paramMap.get('idArrendador')!;
    this.router.navigate([`/arrendador/${idArrendador}/propiedades`]);
  }

  getImagenUrl(nombreImagen: string): string {
    return `http://${this.ip}${nombreImagen}`;
  }
}
