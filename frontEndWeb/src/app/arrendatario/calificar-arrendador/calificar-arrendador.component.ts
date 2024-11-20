import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CalificacionService } from '../../services/calificacion.service';
import { Arrendador } from '../../interfaces/arrendador.interface';

@Component({
  selector: 'app-calificar-arrendador',
  templateUrl: './calificar-arrendador.component.html',
  styleUrls: ['./calificar-arrendador.component.css']
})
export class CalificarArrendadorComponent implements OnInit {
  arrendadoresPorCalificar: Arrendador[] = []; // Lista de arrendadores
  arrendadorSeleccionado: Arrendador | null = null; // Arrendador seleccionado para calificar
  idArrendatario: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService, // Servicio para manejar usuarios
    private calificacionService: CalificacionService // Servicio para manejar las calificaciones
  ) {}

  ngOnInit() {
    // Validar token JWT
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']);
      return;
    }

    this.idArrendatario = +this.route.snapshot.paramMap.get('idArrendatario')!;

    // Cargar los arrendadores por calificar a través del servicio
    this.usuarioService.getAllArrendadores().subscribe(
      (data: Arrendador[]) => {
        this.arrendadoresPorCalificar = data;
      },
      (error) => {
        console.error('Error al cargar arrendadores:', error);
      }
    );
  }

  calificar(arrendador: Arrendador) {
    this.arrendadorSeleccionado = arrendador; // Selecciona al arrendador para calificar
  }

  enviarCalificacion() {
    if (this.arrendadorSeleccionado && this.arrendadorSeleccionado.calificacion) {
      const calificacionData = {
        idArrendador: this.arrendadorSeleccionado.id,
        calificacion: this.arrendadorSeleccionado.calificacion,
        comentario: this.arrendadorSeleccionado.comentario || ''
      };

      // Enviar la calificación a través del servicio
      this.calificacionService.calificarArrendador(calificacionData).subscribe(
        (response) => {
          console.log('Calificación enviada exitosamente:', response);
          // Remover el arrendador de la lista tras ser calificado
          this.arrendadoresPorCalificar = this.arrendadoresPorCalificar.filter(a => a.id !== this.arrendadorSeleccionado!.id);
          this.arrendadorSeleccionado = null; // Limpiar selección
          alert('Calificación enviada con éxito!');
        },
        (error) => {
          console.error('Error al enviar la calificación:', error);
          alert('Error al enviar la calificación.');
        }
      );
    }
  }

  // Métodos de navegación a otras vistas
  navigateToVerContratos() {
    this.router.navigate([`/arrendatario/${this.idArrendatario}/contratos`]);
  }

  navigateToCalificar() {
    this.router.navigate([`/arrendatario/${this.idArrendatario}/calificar`]);
  }

  navigateToPrincipal() {
    this.router.navigate([`/arrendatario/${this.idArrendatario}`]);
  }
}
