import { Component, OnInit } from '@angular/core';
import { PropiedadesService } from '../../services/propiedades.service';
import { Router } from '@angular/router';
import { Propiedad } from '../../interfaces/propiedad.interface';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-propiedades-arrendador',
  templateUrl: './propiedades-arrendador.component.html',
  styleUrls: ['./propiedades-arrendador.component.css'],
})
export class PropiedadesArrendadorComponent implements OnInit {
  propiedades: Propiedad[] = [];
  ip: string = 'localhost';
  imagenUrl: { [key: number]: SafeUrl } = {};

  constructor(
    private propiedadesService: PropiedadesService,
    private router: Router,
    private http: HttpClient,

    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    this.obtenerPropiedades();
  }

  // Método para cargar imágenes
  cargarImagen(nombreImagen: string, idPropiedad: number): void {
    if (!nombreImagen) {
      console.warn(`La propiedad con ID ${idPropiedad} no tiene una imagen asociada.`);
      this.imagenUrl[idPropiedad] = 'assets/default-image.jpg';
      return;
    }

    this.getImagen(nombreImagen).subscribe(
      (imagen) => {
        const url = URL.createObjectURL(imagen);
        this.imagenUrl[idPropiedad] = this.sanitizer.bypassSecurityTrustUrl(url);
      },
      (error) => {
        console.error(`Error al cargar la imagen para la propiedad ${idPropiedad}:`, error);
        this.imagenUrl[idPropiedad] = 'assets/default-image.jpg';
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

    return this.http.get(`http://localhost/api/arrendador/imagenes/${nombreImagen}`, {
      headers,
      responseType: 'blob',
    });
  }


  obtenerPropiedades() {
    this.propiedadesService.getPropiedadesArrendador().subscribe(
      (data) => {
        console.log('Propiedades obtenidas:', data);
        this.propiedades = data;

        this.propiedades.forEach((propiedad) => {
          if (propiedad.urlImagen) {
            this.cargarImagen(propiedad.urlImagen, propiedad.id);
          }
        });
      },
      (error) => {
        console.error('Error al obtener propiedades:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  // Método para agregar una nueva propiedad (redirige a la pantalla de creación)
  agregarPropiedad() {
    this.router.navigate(['/arrendador/propiedades/crear-propiedad']); // Navega a la vista de creación de propiedad
  }

  // Método para redirigir a la pantalla de edición de propiedad
  editarPropiedad(idPropiedad: number) {
    this.router.navigate([`/arrendador/propiedades/editar-propiedad/${idPropiedad}`]);
  }

  // Método para ver los detalles de una propiedad
  verDetallePropiedad(idPropiedad: number) {
    this.router.navigate([`/arrendador/propiedades/detalle-propiedad/${idPropiedad}`]);
  }
}
