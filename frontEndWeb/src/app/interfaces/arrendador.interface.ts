export interface Arrendador {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    promedio: number;
    cantiCalif: number;
    calificacion?: number; // Campo para la calificación que el usuario ingresará
    comentario?: string;   // Campo para el comentario que el usuario ingresará
  }