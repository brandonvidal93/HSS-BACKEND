import { Pastor } from "../entities/Pastor";

/**
 * Contrato (Interface) del Repositorio de Pastores.
 * La capa de Aplicación (Lógica de Negocio) SOLO interactúa con este contrato.
 */

export interface PastorRepository {
  findById(id: string): Promise<Pastor | null>;
  findAll(limit?: number, offset?: number): Promise<Pastor[]>;
  save(pastor: Pastor): Promise<Pastor>; // Crear o actualizar un pastor
  delete(id: string): Promise<boolean>;

  // Métodos adicionales específicos para Pastor
  findPastoresByTemplo(temploId: string): Promise<Pastor[]>;
}