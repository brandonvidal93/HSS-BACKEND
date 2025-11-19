export interface Comite {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  // Relación con el miembro que es líder del comité
  liderId: string;
  // Relación con el templo al que pertenece el comité
  temploId: string;
}