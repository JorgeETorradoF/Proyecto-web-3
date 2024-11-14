import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CalificacionService } from '../../services/calificacion.service';

interface Arrendatario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  promedio: number;
  cantiCalif: number;
  calificacion?: number; // Campo para la calificación que el usuario ingresará
  comentario?: string;   // Campo para el comentario que el usuario ingresará
}

@Component({
  selector: 'app-calificar-arrendatario',
  templateUrl: './calificar-arrendatario.component.html',
  styleUrls: ['./calificar-arrendatario.component.css'] // styleUrls corregido
})
export class CalificarArrendatarioComponent implements OnInit {
  arrendatariosPorCalificar: Arrendatario[] = []; // Lista de arrendatarios
  arrendatarioSeleccionado: Arrendatario | null = null; // arrendatario seleccionado para calificar

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService, // Servicio para manejar usuarios
    private calificacionService: CalificacionService // Servicio para manejar las calificaciones
  ) {}

  ngOnInit() {
    // Verificar si el token está presente
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado. Redirigiendo a inicio de sesión.');
      this.router.navigate(['/login']); // Redirigir al inicio de sesión si no hay token
      return;
    }

    // Cargar los arrendatarios por calificar a través del servicio
    this.usuarioService.getAllArrendatarios().subscribe(
      (data: Arrendatario[]) => {
        this.arrendatariosPorCalificar = data;
        console.log('Arrendatarios cargados:', this.arrendatariosPorCalificar);
      },
      (error) => {
        console.error('Error al cargar arrendatarios:', error);
        if (error.status === 401) {
          console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
          localStorage.removeItem('token'); // Remover token inválido
          this.router.navigate(['/login']);
        }
      }
    );
  }

  calificar(arrendatario: Arrendatario) {
    this.arrendatarioSeleccionado = arrendatario; // Selecciona al arrendatario para calificar
  }

  enviarCalificacion() {
    if (this.arrendatarioSeleccionado && this.arrendatarioSeleccionado.calificacion) {
      const calificacionData = {
        idArrendatario: this.arrendatarioSeleccionado.id,
        calificacion: this.arrendatarioSeleccionado.calificacion,
        comentario: this.arrendatarioSeleccionado.comentario || ''
      };

      // Enviar la calificación a través del servicio
      this.calificacionService.calificarArrendatario(calificacionData).subscribe(
        (response) => {
          console.log('Calificación enviada exitosamente:', response);
          // Remover el arrendatario de la lista tras ser calificado
          this.arrendatariosPorCalificar = this.arrendatariosPorCalificar.filter(a => a.id !== this.arrendatarioSeleccionado!.id);
          this.arrendatarioSeleccionado = null; // Limpiar selección
          alert('Calificación enviada con éxito!');
        },
        (error) => {
          console.error('Error al enviar la calificación:', error);
          if (error.status === 401) {
            console.warn('Token no válido o expirado. Redirigiendo a inicio de sesión.');
            localStorage.removeItem('token'); // Remover token inválido
            this.router.navigate(['/login']);
          } else {
            alert('Error al enviar la calificación.');
          }
        }
      );
    }
  }
}
