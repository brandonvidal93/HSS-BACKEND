/**
 * MiembroDTO (Data Transfer Object): 
 * Define la estructura de datos esperada en la entrada 
 * para registrar un nuevo miembro.
 */
export interface MiembroDTO {
  nombres: string;
  apellidos: string;
  fechaNacimiento: string; // Se recibe como string (ej. 'YYYY-MM-DD')
  telefono: string;
  email: string;
  estado: string;
  fechaRegistro: Date;
  fechaBautismo?: Date;
  activo: boolean;
  // Solo se requiere el ID de la iglesia para la vinculación
  temploId: string; 
}