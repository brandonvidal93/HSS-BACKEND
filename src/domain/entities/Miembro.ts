export interface Miembro {
  id: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  telefono: string;
  email: string;
  estado: 'SERVIDOR' | 'BAUTIZADO' | 'SIMPATIZANTE' | 'NO_ASOCIADO';
  fechaRegistro: Date;
  fechaBautismo?: Date;
  activo: boolean;
  // Relación con la iglesia a la que pertenece el miembro
  temploId: string;
}