import { Component, OnInit } from '@angular/core';
import { PropiedadesService } from '../../services/propiedades.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Propiedad {
  id: number;
  nombrePropiedad: string;
  descripcion: string;
  valorNoche: number;
  departamento: string;
  municipio: string;
  urlImagen: string; // Para la imagen
}

@Component({
  selector: 'app-propiedades-arrendador',
  templateUrl: './propiedades-arrendador.component.html',
  styleUrls: ['./propiedades-arrendador.component.css']
})
export class PropiedadesArrendadorComponent implements OnInit {
  propiedades: Propiedad[] = [];
  idArrendador!: number; // Se obtiene de la URL
  ip: string = 'localhost'; // IP del servidor backend

  constructor(
    private propiedadesService: PropiedadesService,
    private route: ActivatedRoute,
    private router: Router // Inyecta el servicio Router
  ) {}

  ngOnInit() {
    // Verificar si el token está presente
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']); // Redirigir al inicio de sesión si no hay token
      return;
    }

    // Obtiene el id del arrendador desde la ruta (URL)
    this.idArrendador = +this.route.snapshot.paramMap.get('idArrendador')!;
    this.obtenerPropiedades();
  }

  // Método para obtener la URL de la imagen
  getImagenUrl(nombreImagen: string): string {
    return `http://${this.ip}${nombreImagen}`;
  }

  // Método para obtener las propiedades del arrendador desde el servicio
  obtenerPropiedades() {
    this.propiedadesService.getPropiedadesArrendador(this.idArrendador).subscribe(
      (data) => {
        console.log('Propiedades obtenidas:', data);
        this.propiedades = data; // Asigna las propiedades obtenidas a la variable
      },
      (error) => {
        console.error('Error al obtener propiedades:', error); // Muestra un mensaje de error si algo sale mal
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('token'); // Remover token inválido
          this.router.navigate(['/login']);
        }
      }
    );
  }

  // Método para agregar una nueva propiedad (redirige a la pantalla de creación)
  agregarPropiedad() {
    this.router.navigate([`/arrendador/${this.idArrendador}/propiedades/crear-propiedad`]); // Navega a la vista de creación de propiedad con el idArrendador
  }

  // Método para redirigir a la pantalla de edición de propiedad
  editarPropiedad(idPropiedad: number) {
    this.router.navigate([`/arrendador/${this.idArrendador}/propiedades/editar-propiedad/${idPropiedad}`]);
  }

  // Método para ver los detalles de una propiedad
  verDetallePropiedad(idPropiedad: number) {
    this.router.navigate([`/arrendador/${this.idArrendador}/propiedades/detalle-propiedad/${idPropiedad}`]);
  }
}
