import { Component, OnInit } from '@angular/core';
import { PropiedadesService } from '../../../services/propiedades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from '../../../interfaces/propiedad.interface';

interface ImagenPreview {
  file: File;
  preview: string | ArrayBuffer;
}

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

  idArrendador!: number;
  selectedFile: File | null = null;
  imagenes: ImagenPreview[] = [];
  imagenSeleccionada: string | ArrayBuffer | null = null;
  maxImagenes = 5;

  constructor(
    private propiedadesService: PropiedadesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar si el token existe
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    this.idArrendador = +this.route.snapshot.paramMap.get('idArrendador')!;
  }

  // Método para seleccionar el archivo
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

  // Método para crear una propiedad nueva
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

    // Si no se selecciona la imagen
    if (!this.selectedFile) {
      console.error('Error: No se ha seleccionado ninguna imagen');
      return;
    }

    // Crear FormData para enviar la imagen junto con los datos de la propiedad
    const formData = new FormData();
    formData.append('imagen', this.selectedFile);

    // Inicializa los campos booleanos si no están seleccionados
    this.propiedad.permiteMascotas = this.propiedad.permiteMascotas || false;
    this.propiedad.tienePiscina = this.propiedad.tienePiscina || false;
    this.propiedad.tieneAsador = this.propiedad.tieneAsador || false;

    // Crea el objeto propiedadDTO y lo agrega a formData
    const propiedadDTO = {
      nombrePropiedad: this.propiedad.nombrePropiedad.trim(),
      descripcion: this.propiedad.descripcion ? this.propiedad.descripcion.trim() : '',
      valorNoche: this.propiedad.valorNoche ? this.propiedad.valorNoche.toString() : '0',
      departamento: this.propiedad.departamento.trim(),
      municipio: this.propiedad.municipio.trim(),
      tipoIngreso: this.propiedad.tipoIngreso.trim(),
      cantidadHabitaciones: this.propiedad.cantidadHabitaciones ? this.propiedad.cantidadHabitaciones.toString() : '1',
      cantidadBanos: this.propiedad.cantidadBanos ? this.propiedad.cantidadBanos.toString() : '0',
      permiteMascotas: this.propiedad.permiteMascotas.toString(),
      tienePiscina: this.propiedad.tienePiscina.toString(),
      tieneAsador: this.propiedad.tieneAsador.toString(),
    };

    formData.append('propiedadDTO', new Blob([JSON.stringify(propiedadDTO)], { type: 'application/json' }));

    // Llama al servicio para crear la propiedad con la imagen y los datos
    this.propiedadesService.crearPropiedadConImagen(this.idArrendador, formData).subscribe(
      (data) => {
        console.log('Propiedad creada:', data);
        this.router.navigate([`/arrendador/${this.idArrendador}/propiedades`]);
      },
      (error) => {
        console.error('Error al crear propiedad:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  // Método que se invocará al enviar el formulario
  onSubmit() {
    this.crearPropiedad();
  }

  // Método para cambiar la imagen seleccionada
  cambiarImagen() {
    this.imagenSeleccionada = null;
    this.selectedFile = null;
  }

  // Método para cancelar la creación de propiedad
  cancelar() {
    if (confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate([`/arrendador/${this.idArrendador}/propiedades`]);
    }
  }

  // Método para eliminar una imagen seleccionada
  removeImage(index: number) {
    this.imagenes.splice(index, 1);
  }
}
