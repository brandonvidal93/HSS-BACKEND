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

  async update(id: string, data: Partial<ComiteDTO>): Promise<Comite | null> {
    const comiteExistente = await this.comiteRepo.findById(id);
    if (!comiteExistente) {
      return null;
    }

    const fechaCreacion = data.fechaCreacion
      ? new Date(data.fechaCreacion)
      : comiteExistente.fechaCreacion;

    const comiteActualizado: Comite = {
      ...comiteExistente,
      nombre: data.nombre || comiteExistente.nombre,
      descripcion: data.descripcion || comiteExistente.descripcion,
      fechaCreacion: fechaCreacion,
      liderId: data.liderId || comiteExistente.liderId,
      temploId: data.temploId || comiteExistente.temploId,
    };

    if (isNaN(comiteActualizado.fechaCreacion.getTime())) {
      throw new Error('La fecha de creación proporcionada no es válida.');
    }

    return this.comiteRepo.save(comiteActualizado);
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