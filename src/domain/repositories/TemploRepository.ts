import { Templo } from "../entities/Templo";

export interface TemploRepository {
  findById(id: string): Promise<Templo | null>;
  findAll(limit?: number, offset?: number): Promise<Templo[]>;
  save(templo: Templo): Promise<Templo>; // Crear o actualizar un templo
  delete(id: string): Promise<boolean>;
}