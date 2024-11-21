import { Component, OnInit } from '@angular/core';
import { PropiedadesService } from '../../services/propiedades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from '../../interfaces/propiedad.interface';


@Component({
  selector: 'app-principal-arrendatario',
  templateUrl: './principal-arrendatario.component.html',
  styleUrls: ['./principal-arrendatario.component.css'],
})
export class PrincipalArrendatarioComponent implements OnInit {
  propiedades: Propiedad[] = [];
  filteredPropiedades: Propiedad[] = [];
  searchTerm: string = '';
  suggestions: string[] = [];

  constructor(
    private propiedadesService: PropiedadesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Validar si el token JWT está presente
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    // Obtener propiedades disponibles para arrendatarios
    this.obtenerPropiedades();
  }

  getImagenUrl(urlImagen: string | null): string {
    return urlImagen || '../../../assets/images/finca.webp';
  }

  // Método para obtener todas las propiedades disponibles
  obtenerPropiedades(): void {
    this.propiedadesService.getAllPropiedades().subscribe(
      (data) => {
        console.log('Propiedades obtenidas:', data);
        this.propiedades = data;
        this.filteredPropiedades = data; // Inicializar propiedades filtradas
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

  // Método de búsqueda
  search(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredPropiedades = this.propiedades.filter((propiedad) =>
      propiedad.municipio.toLowerCase().includes(searchTermLower)
    );
  }

  updateSuggestions(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.suggestions = this.propiedades
      .map((propiedad) => propiedad.municipio)
      .filter((ubicacion) =>
        ubicacion.toLowerCase().includes(searchTermLower)
      )
      .slice(0, 3); // Mostrar máximo 3 sugerencias
  }

  selectSuggestion(suggestion: string): void {
    this.searchTerm = suggestion;
    this.search();
    this.suggestions = []; // Limpiar sugerencias después de seleccionar
  }

  // Método para redirigir a los detalles de la propiedad
  verDetallePropiedad(idPropiedad: number): void {
    this.router.navigate([`/detalle-propiedad/${idPropiedad}`]);
  }
}


// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// interface Propiedad {
//   id: number;
//   nombrePropiedad: string;
//   descripcion: string;
//   valorNoche: number;
//   departamento: string;
//   municipio: string;
//   tipoIngreso: string;
//   cantidadHabitaciones: number;
//   cantidadBanos: number;
//   permiteMascotas: boolean;
//   tienePiscina: boolean;
//   tieneAsador: boolean;
//   urlImagen: string;
// }

// @Component({
//   selector: 'app-principal-arrendatario',
//   templateUrl: './principal-arrendatario.component.html',
//   styleUrls: ['./principal-arrendatario.component.css']
// })
// export class PrincipalArrendatarioComponent implements OnInit {
//   propiedad: Propiedad | undefined;
//   filteredPropiedades: Propiedad[] = [];
//   searchTerm = '';
//   suggestions: string[] = [];

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     // Propiedad de ejemplo para ver los cambios sin usar el servicio
//     this.filteredPropiedades = [
//       {
//         id: 1,
//         nombrePropiedad: 'Finca El Paraíso',
//         descripcion: 'Una finca hermosa con vista a las montañas.',
//         valorNoche: 300000,
//         departamento: 'Quindío',
//         municipio: 'Armenia',
//         tipoIngreso: 'Turismo',
//         cantidadHabitaciones: 4,
//         cantidadBanos: 3,
//         permiteMascotas: true,
//         tienePiscina: true,
//         tieneAsador: true,
//         urlImagen: 'https://example.com/finca.jpg'
//       },
//       {
//         id: 2,
//         nombrePropiedad: 'Hacienda Los Rosales',
//         descripcion: 'Amplia hacienda con piscina y zonas verdes.',
//         valorNoche: 450000,
//         departamento: 'Antioquia',
//         municipio: 'Medellín',
//         tipoIngreso: 'Turismo',
//         cantidadHabitaciones: 5,
//         cantidadBanos: 4,
//         permiteMascotas: false,
//         tienePiscina: true,
//         tieneAsador: true,
//         urlImagen: 'https://example.com/hacienda.jpg'
//       }
//     ];
//   }

//   search() {
//     const searchTermLower = this.searchTerm.toLowerCase();
//     this.filteredPropiedades = this.filteredPropiedades.filter(propiedad =>
//       propiedad.municipio.toLowerCase().includes(searchTermLower)
//     );
//   }

//   updateSuggestions() {
//     const searchTermLower = this.searchTerm.toLowerCase();
//     this.suggestions = this.filteredPropiedades
//       .map(propiedad => propiedad.municipio)
//       .filter(municipio => municipio.toLowerCase().includes(searchTermLower));
//   }

//   selectSuggestion(suggestion: string) {
//     this.searchTerm = suggestion;
//     this.search();
//     this.suggestions = [];
//   }

//   navigateToCalificarArrendador() {
//     this.router.navigate(['/arrendatario/1/calificar-arrendador']); // Redirige a la página de calificación
//   }
// }
