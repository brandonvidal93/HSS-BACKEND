export interface Templo {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  pais: string;
  fechaFundacion: Date;
  // Relación con el pastor principal del templo
  pastorPrincipalId: string;
}