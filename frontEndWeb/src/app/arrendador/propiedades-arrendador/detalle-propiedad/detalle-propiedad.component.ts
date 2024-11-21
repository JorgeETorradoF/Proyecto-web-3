import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../../../services/propiedades.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detalle-propiedad',
  templateUrl: './detalle-propiedad.component.html',
  styleUrls: ['./detalle-propiedad.component.css'],
})
export class DetallePropiedadComponent implements OnInit {
  propiedad: any = {};
  idPropiedad!: number;
  ip: string = 'localhost';
  imagenUrl: SafeUrl = 'assets/default-image.jpg'; // Imagen por defecto

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propiedadesService: PropiedadesService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    this.idPropiedad = +this.route.snapshot.paramMap.get('idPropiedad')!;

    if (this.idPropiedad) {
      this.obtenerDetallePropiedad(this.idPropiedad);
    } else {
      console.error('Error: ID de la propiedad no encontrado.');
      this.router.navigate(['/arrendador/propiedades']);
    }
  }

  obtenerDetallePropiedad(idPropiedad: number): void {
    this.propiedadesService.getPropiedad(idPropiedad).subscribe(
      (data) => {
        this.propiedad = data;
        console.log('Detalles de la propiedad:', data);

        // Cargar la imagen asociada a la propiedad
        if (this.propiedad.urlImagen) {
          this.cargarImagen(this.propiedad.urlImagen);
        }
      },
      (error) => {
        console.error('Error al obtener los detalles de la propiedad:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  cargarImagen(nombreImagen: string): void {
    if (!nombreImagen) {
      console.warn('La propiedad no tiene una imagen asociada.');
      this.imagenUrl = 'assets/default-image.jpg';
      return;
    }

    this.getImagen(nombreImagen).subscribe(
      (imagen) => {
        const url = URL.createObjectURL(imagen);
        this.imagenUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      },
      (error) => {
        console.error('Error al cargar la imagen:', error);
        this.imagenUrl = 'assets/default-image.jpg';
      }
    );
  }

  getImagen(nombreImagen: string): Observable<Blob> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado en localStorage');
      throw new Error('Token no encontrado');
    }

    if (nombreImagen.startsWith('/api/arrendador/imagenes/')) {
      nombreImagen = nombreImagen.replace('/api/arrendador/imagenes/', '');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Construcción correcta de la URL
    return this.http.get(`http://${this.ip}/api/arrendador/imagenes/${nombreImagen}`, {
      headers,
      responseType: 'blob',
    });
  }

  editarPropiedad(idPropiedad: number): void {
    this.router.navigate([`/arrendador/propiedades/editar-propiedad/${idPropiedad}`]);
  }

  volver(): void {
    this.router.navigate(['/arrendador/propiedades']);
  }
}
