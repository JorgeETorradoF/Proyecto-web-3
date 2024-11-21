import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CalificacionService } from '../../services/calificacion.service';
import { Arrendador } from '../../interfaces/arrendador.interface';

@Component({
  selector: 'app-calificar-arrendador',
  templateUrl: './calificar-arrendador.component.html',
  styleUrls: ['./calificar-arrendador.component.css'],
})
export class CalificarArrendadorComponent implements OnInit {
  arrendadoresPorCalificar: Arrendador[] = []; // Lista de arrendadores
  arrendadorSeleccionado: Arrendador | null = null; // Arrendador seleccionado para calificar

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService, // Servicio para manejar usuarios
    private calificacionService: CalificacionService // Servicio para manejar las calificaciones
  ) {}

  ngOnInit(): void {
    // Validar token JWT
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    // Cargar los arrendadores por calificar
    this.cargarArrendadores();
  }

  cargarArrendadores(): void {
    this.usuarioService.getAllArrendadores().subscribe(
      (data: Arrendador[]) => {
        this.arrendadoresPorCalificar = data;
        console.log('Arrendadores cargados:', this.arrendadoresPorCalificar);
      },
      (error) => {
        console.error('Error al cargar arrendadores:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  calificar(arrendador: Arrendador): void {
    this.arrendadorSeleccionado = arrendador; // Seleccionar arrendador para calificar
  }

  enviarCalificacion(): void {
    if (this.arrendadorSeleccionado && this.arrendadorSeleccionado.calificacion) {
      const calificacion = this.arrendadorSeleccionado.calificacion;

      // Enviar la calificación a través del servicio
      this.calificacionService.calificarArrendador(calificacion).subscribe(
        (response) => {
          console.log('Calificación enviada exitosamente:', response);

          // Remover arrendador calificado de la lista
          this.arrendadoresPorCalificar = this.arrendadoresPorCalificar.filter(
            (a) => a.id !== this.arrendadorSeleccionado!.id
          );

          this.arrendadorSeleccionado = null; // Limpiar selección
          alert('Calificación enviada con éxito.');
        },
        (error) => {
          console.error('Error al enviar la calificación:', error);
          if (error.status === 401) {
            console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
            localStorage.removeItem('authToken');
            this.router.navigate(['/login']);
          } else {
            alert('Error al enviar la calificación. Intente nuevamente.');
          }
        }
      );
    }
  }

  // Métodos de navegación
  navigateToVerContratos(): void {
    this.router.navigate(['/arrendatario/contratos']);
  }

  navigateToCalificar(): void {
    this.router.navigate(['/arrendatario/calificar']);
  }

  navigateToPrincipal(): void {
    this.router.navigate(['/arrendatario']);
  }
}
