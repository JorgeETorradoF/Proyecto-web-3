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
  idArrendatario!: number; // Se obtiene de la URL
  ip: string = 'localhost'; // IP del servidor backend

  constructor(
    private propiedadesService: PropiedadesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar si el token JWT está presente
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    // Obtiene el id del arrendatario desde la ruta (URL)
    this.idArrendatario = +this.route.snapshot.paramMap.get('idArrendatario')!;
    this.obtenerPropiedades(); // Llamamos para obtener las propiedades
  }

  getImagenUrl(nombreImagen: string): string {
    return `http://${this.ip}${nombreImagen}`;
  }

  // Método para obtener todas las propiedades disponibles
  obtenerPropiedades() {
    this.propiedadesService.getAllPropiedades().subscribe(
      (data) => {
        console.log('Propiedades obtenidas:', data);
        this.propiedades = data;
        this.filteredPropiedades = data; // Inicializamos las propiedades filtradas
      },
      (error) => {
        console.error('Error al obtener propiedades:', error);
      }
    );
  }

  // Métodos de búsqueda
  search() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredPropiedades = this.propiedades.filter((propiedad) =>
      propiedad.municipio.toLowerCase().includes(searchTermLower)
    );
  }

  updateSuggestions() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.suggestions = this.propiedades
      .map((propiedad) => propiedad.municipio)
      .filter((ubicacion) =>
        ubicacion.toLowerCase().includes(searchTermLower)
      )
      .slice(0, 2);
  }

  selectSuggestion(suggestion: string) {
    this.searchTerm = suggestion;
    this.search();
    this.suggestions = []; // Limpia las sugerencias después de seleccionar
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
