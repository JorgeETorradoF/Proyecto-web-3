import { ImagenPreview } from './../../../interfaces/imagen-preview.interface';
import { Component, OnInit } from '@angular/core';
import { PropiedadesService } from '../../../services/propiedades.service';
import { Router } from '@angular/router';
import { Propiedad } from '../../../interfaces/propiedad.interface';

@Component({
  selector: 'app-crear-propiedad',
  templateUrl: './crear-propiedad.component.html',
  styleUrls: ['./crear-propiedad.component.css']
})
export class CrearPropiedadComponent implements OnInit {
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
    urlImagen: ''
  };

  selectedFile: File | null = null;
  imagenes: ImagenPreview[] = [];
  imagenSeleccionada: string | ArrayBuffer | null = null;
  maxImagenes = 5;

  constructor(
    private propiedadesService: PropiedadesService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar si el token existe
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenSeleccionada = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
    console.log('Archivo seleccionado:', this.selectedFile);
  }

  crearPropiedad() {
    if (
      this.propiedad.nombrePropiedad === '' ||
      this.propiedad.departamento === '' ||
      this.propiedad.municipio === '' ||
      this.propiedad.tipoIngreso === ''
    ) {
      console.error('Error: Algunos campos requeridos están vacíos');
      return;
    }

    if (!this.selectedFile) {
      console.error('Error: No se ha seleccionado ninguna imagen');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', this.selectedFile);

    const propiedadDTO = {
      nombrePropiedad: this.propiedad.nombrePropiedad.trim(),
      descripcion: this.propiedad.descripcion?.trim() || '',
      valorNoche: this.propiedad.valorNoche.toString(),
      departamento: this.propiedad.departamento.trim(),
      municipio: this.propiedad.municipio.trim(),
      tipoIngreso: this.propiedad.tipoIngreso.trim(),
      cantidadHabitaciones: this.propiedad.cantidadHabitaciones.toString(),
      cantidadBanos: this.propiedad.cantidadBanos.toString(),
      permiteMascotas: this.propiedad.permiteMascotas.toString(),
      tienePiscina: this.propiedad.tienePiscina.toString(),
      tieneAsador: this.propiedad.tieneAsador.toString(),
    };

    formData.append('propiedadDTO', new Blob([JSON.stringify(propiedadDTO)], { type: 'application/json' }));

    this.propiedadesService.crearPropiedadConImagen(formData).subscribe(
      (data) => {
        console.log('Propiedad creada:', data);
        this.router.navigate(['/arrendador/propiedades']);
      },
      (error) => {
        console.error('Error al crear propiedad:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  onSubmit() {
    this.crearPropiedad();
  }

  cambiarImagen() {
    this.imagenSeleccionada = null;
    this.selectedFile = null;
  }

  cancelar() {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/arrendador/propiedades']);
    }
  }

  removeImage(index: number) {
    this.imagenes.splice(index, 1);
  }
}
