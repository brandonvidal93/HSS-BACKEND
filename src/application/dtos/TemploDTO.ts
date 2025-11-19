export interface TemploDTO {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  pais: string;
  // Relación con el pastor principal del templo
  pastorPrincipalId: string;
  fechaFundacion: Date;
}