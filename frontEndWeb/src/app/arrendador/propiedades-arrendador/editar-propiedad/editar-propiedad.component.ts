import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../../../services/propiedades.service';
import { Propiedad } from './propiedad.interface'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-editar-propiedad',
  templateUrl: './editar-propiedad.component.html',
  styleUrls: ['./editar-propiedad.component.css'],
})
export class EditarPropiedadComponent implements OnInit {
  propiedad: Propiedad = {
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

  idArrendador!: number;
  idPropiedad!: number;
  nuevaImagen: string | ArrayBuffer | null = null; // Para la vista previa de la nueva imagen
  ip: string = 'localhost';

  editarCampos: { [key: string]: boolean } = {}; // Control de edición por campo

  @ViewChild('fileInput') fileInput!: ElementRef; // Referencia al input de archivo

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

    this.cargarPropiedad();
  }

  cargarPropiedad(): void {
    this.propiedadesService.getPropiedad(this.idArrendador, this.idPropiedad).subscribe(
      (data) => {
        console.log('Propiedad recibida:', data);
        this.propiedad = data;
      },
      (error) => {
        console.error('Error al cargar la propiedad:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        } else {
          alert('No se pudo cargar la propiedad. Intente más tarde.');
        }
      }
    );
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
      this.propiedadesService
        .editarPropiedad(this.idArrendador, this.idPropiedad, this.propiedad)
        .subscribe(
          (response) => {
            console.log('Propiedad actualizada:', response);
            this.router.navigate([`/arrendador/${this.idArrendador}/propiedades`]);
          },
          (error) => {
            console.error('Error al actualizar la propiedad:', error);
            if (error.status === 401) {
              console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
              localStorage.removeItem('token');
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
    this.router.navigate([`/arrendador/${this.idArrendador}/propiedades`]);
  }

  getImagenUrl(nombreImagen: string): string {
    return `http://${this.ip}${nombreImagen}`;
  }
}
