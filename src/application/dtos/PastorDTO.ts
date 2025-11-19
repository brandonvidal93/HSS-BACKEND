/**
 * PastorDTO Data Transfer Object
 * Define la estructura de datos esperada en la entrada 
 * para registrar un nuevo pastor.
 */

export interface PastorDTO {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fechaNacimiento: Date; // Se recibe como string (ej. 'YYYY-MM-DD')
  fechaOrdenacion: Date; // Se recibe como string (ej. 'YYYY-MM-DD')
  licenciaMinisterial: string;
  estado: 'ACTIVO' | 'JUBILADO' | 'SANCIONADO' | 'EN_PROCESO';
  temploId: string; // Solo se requiere el ID del templo para la vinculación
}