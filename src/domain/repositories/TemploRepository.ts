import { Templo } from "../entities/Templo";

export interface TemploRepository {
  findById(id: string): Promise<Templo | null>;
  findAll(): Promise<Templo[]>;
  save(templo: Templo): Promise<Templo>;
  update(id: string, templo: Templo): Promise<Templo>;
  delete(id: string): Promise<boolean>;
}