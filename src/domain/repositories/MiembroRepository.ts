import { Miembro } from "../entities/Miembro";

/**
 * Contrato (Interface) del Repositorio de Miembros.
 * La capa de Aplicación (Lógica de Negocio) SOLO interactúa con este contrato.
 */

export interface MiembroRepository {
  findById(id: string): Promise<Miembro | null>;
  findAll(limit?: number, offset?: number): Promise<Miembro[]>;
  save(miembro: Miembro): Promise<Miembro>; // Crear o actualizar un miembro
  delete(id: string): Promise<boolean>;

  // Medotos adicionales específicos para Miembro
  findMiembrosByTemplo(temploId: string): Promise<Miembro[]>;
  findByEmail(email: string): Promise<Miembro | null>;
}
