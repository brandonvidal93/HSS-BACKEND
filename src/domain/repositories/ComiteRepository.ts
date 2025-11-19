import { Comite } from "../entities/Comite";

/**
 * Contrato (Interface) del Repositorio de Comités.
 * La capa de Aplicación (Lógica de Negocio) SOLO interactúa con este contrato.
 */

export interface ComiteRepository {
  findById(id: string): Promise<Comite | null>;
  findAll(limit?: number, offset?: number): Promise<Comite[]>;
  save(comite: Comite): Promise<Comite>; // Crear o actualizar un comité
  delete(id: string): Promise<boolean>;

  // Medotos adicionales específicos para Comite
  findComitesByTemplo(temploId: string): Promise<Comite[]>;
}