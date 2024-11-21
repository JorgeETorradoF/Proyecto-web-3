import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../../../services/propiedades.service';
import { Propiedad } from './propiedad.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-editar-propiedad',
  templateUrl: './editar-propiedad.component.html',
  styleUrls: ['./editar-propiedad.component.css'],
})
export class EditarPropiedadComponent implements OnInit {
  propiedad: Propiedad = {
    id: 0,
    nombrePropiedad: '',
    descripcion: '',
    valorNoche: 0,
    departamento: '',
    municipio: '',
    tipoIngreso: '',
    cantidadHabitaciones: 1,
    cantidadBanos: 1,
    permiteMascotas: false,
    tienePiscina: false,
    tieneAsador: false,
    urlImagen: '',
  };


  idPropiedad!: number;
  nuevaImagen: string | ArrayBuffer | null = null;
  ip: string = 'localhost';
  imagenUrl: SafeUrl = 'assets/default-image.jpg';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propiedadesService: PropiedadesService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  editarCampos: { [key: string]: boolean } = {};


  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    this.idPropiedad = +this.route.snapshot.paramMap.get('idPropiedad')!;

    this.cargarPropiedad();
  }

  cargarPropiedad(): void {
    this.propiedadesService.obtenerPropiedad(this.idPropiedad).subscribe(
      (data) => {
        console.log('Propiedad recibida:', data);
        this.propiedad = data;

        // Cargar la imagen asociada
        if (this.propiedad.urlImagen) {
          this.cargarImagen(this.propiedad.urlImagen);
        }
      },
      (error) => {
        console.error('Error al cargar la propiedad:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        } else {
          alert('No se pudo cargar la propiedad. Intente más tarde.');
        }
      }
    );
  }

  cargarImagen(nombreImagen: string): void {
    if (!nombreImagen) {
      console.warn(`La propiedad no tiene una imagen asociada.`);
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

    return this.http.get(`http://localhost/api/arrendador/imagenes/${nombreImagen}`, {
      headers,
      responseType: 'blob',
    });
  }


  toggleEditar(campo: string): void {
    this.editarCampos[campo] = !this.editarCampos[campo];
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  editarImagen(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.nuevaImagen = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCambios(): void {
    if (this.validarPropiedad()) {
      if (this.nuevaImagen) {
        this.propiedad.urlImagen = this.nuevaImagen as string;
      }
      this.propiedadesService.editarPropiedad(this.idPropiedad, this.propiedad).subscribe(
        (response) => {
          console.log('Propiedad actualizada:', response);
          this.router.navigate(['/arrendador/propiedades']);
        },
        (error) => {
          console.error('Error al actualizar la propiedad:', error);
          if (error.status === 401) {
            console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
            localStorage.removeItem('authToken');
            this.router.navigate(['/login']);
          }
        }
      );
    } else {
      console.error('Error: Todos los campos requeridos deben estar completos.');
    }
  }

  validarPropiedad(): boolean {
    return (
      this.propiedad.id > 0 &&
      this.propiedad.nombrePropiedad.trim() !== '' &&
      this.propiedad.descripcion.trim() !== '' &&
      this.propiedad.departamento.trim() !== '' &&
      this.propiedad.municipio.trim() !== '' &&
      this.propiedad.tipoIngreso.trim() !== '' &&
      this.propiedad.valorNoche > 0 &&
      this.propiedad.cantidadHabitaciones > 0 &&
      this.propiedad.cantidadBanos >= 0
    );
  }


  cancelar(): void {
    this.router.navigate(['/arrendador/propiedades']);
  }


}
