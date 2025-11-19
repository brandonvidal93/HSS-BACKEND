import { Comite } from "../../domain/entities/Comite";
import { ComiteRepository } from "../../domain/repositories/ComiteRepository";
import { ComiteDTO } from "../dtos/ComiteDTO";
import { ComiteFactory } from "../../domain/factories/ComiteFactory";

export class GestionComiteService {
  constructor(private comiteRepo: ComiteRepository) {}

  async findById(id: string): Promise<Comite | null> {
    return this.comiteRepo.findById(id);
  }

  async findAll(): Promise<Comite[]> {
    return this.comiteRepo.findAll();
  }

  async save(dto: ComiteDTO): Promise<Comite> {
    const nuevoComite = ComiteFactory.create(dto);
    return this.comiteRepo.save(nuevoComite);
  }

  async update(id: string, dto: ComiteDTO): Promise<Comite | null> {
    const comiteExistente = await this.comiteRepo.findById(id);
    if (!comiteExistente) {
      return null;
    }

    // Actualizar los campos del comité existente con los datos del DTO
    comiteExistente.nombre = dto.nombre;
    comiteExistente.descripcion = dto.descripcion;
    comiteExistente.fechaCreacion = new Date(dto.fechaCreacion);
    comiteExistente.liderId = dto.liderId;
    comiteExistente.temploId = dto.temploId;

    return this.comiteRepo.save(comiteExistente);
  }

  async delete(id: string): Promise<boolean> {
    return this.comiteRepo.delete(id);
  }

  async asignarLiderComite(comiteId: string, liderId: string): Promise<Comite> {
    const comiteExistente = await this.comiteRepo.findById(comiteId);
    if (!comiteExistente) {
      throw new Error('Comité no encontrado.');
    }

    comiteExistente.liderId = liderId;
    return this.comiteRepo.save(comiteExistente);
  }

  async asignarTemploComite(comiteId: string, temploId: string): Promise<Comite> {
    const comiteExistente = await this.comiteRepo.findById(comiteId);
    if (!comiteExistente) {
      throw new Error('Comité no encontrado.');
    }

    comiteExistente.temploId = temploId;
    return this.comiteRepo.save(comiteExistente);
  }
}