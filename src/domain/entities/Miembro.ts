export interface Miembro {
  id: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  telefono: string;
  email: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';
  fechaRegistro: Date;
  // Relación con la iglesia a la que pertenece el miembro
  iglesiaId: string;
}