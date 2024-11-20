export interface Propiedad {
    id: number;
    nombrePropiedad: string;
    descripcion: string;
    valorNoche: number;
    departamento: string;
    municipio: string;
    tipoIngreso: string;
    cantidadHabitaciones: number;
    cantidadBanos: number;
    permiteMascotas: boolean;
    tienePiscina: boolean;
    tieneAsador: boolean;
    urlImagen: string;
    idArrendador?: number;
  }
  