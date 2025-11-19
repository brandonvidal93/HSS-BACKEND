/**
 * ComiteDTO Data Transfer Object
 * Define la estructura de datos esperada en la entrada 
 * para registrar un nuevo comité.
 */
export interface ComiteDTO {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date; // Se recibe como string (ej. 'YYYY-MM-DD')
  liderId: string; // Solo se requiere el ID del líder para la vinculación
  temploId: string; // Solo se requiere el ID del templo para la vinculación
}