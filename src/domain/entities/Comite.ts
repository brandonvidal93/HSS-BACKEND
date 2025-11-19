export interface Comite {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  // Relación con el miembro que es líder del comité
  liderId: string;
}