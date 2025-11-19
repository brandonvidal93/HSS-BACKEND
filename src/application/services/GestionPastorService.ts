import { Pastor } from "../../domain/entities/Pastor";
import { PastorRepository } from "../../domain/repositories/PastorRepository";
import { PastorDTO } from "../dtos/PastorDTO";
import { PastorFactory } from "../../domain/factories/PastorFactory";

export class GestionPastorService {
  constructor(private pastorRepo: PastorRepository) {}

  async findById(id: string): Promise<Pastor | null> {
    return this.pastorRepo.findById(id);
  }

  async findAll(limit?: number, offset?: number): Promise<Pastor[]> {
    return this.pastorRepo.findAll(limit, offset);
  }

  async save(dto: PastorDTO): Promise<Pastor> {
    const nuevoPastor = PastorFactory.create(dto);
    return this.pastorRepo.save(nuevoPastor);
  }

  async update(id: string, dto: PastorDTO): Promise<Pastor | null> {
    const pastorExistente = await this.pastorRepo.findById(id);
    if (!pastorExistente) {
      return null;
    }

    // Actualizar los campos del pastor existente con los datos del DTO
    pastorExistente.nombre = dto.nombre;
    pastorExistente.apellido = dto.apellido;
    pastorExistente.telefono = dto.telefono;
    pastorExistente.correo = dto.correo;
    pastorExistente.fechaNacimiento = new Date(dto.fechaNacimiento);
    pastorExistente.fechaOrdenacion = new Date(dto.fechaOrdenacion);
    pastorExistente.licenciaMinisterial = dto.licenciaMinisterial;
    pastorExistente.estado = dto.estado;
    pastorExistente.temploId = dto.temploId;

    return this.pastorRepo.save(pastorExistente);
  }

  async delete(id: string): Promise<boolean> {
    return this.pastorRepo.delete(id);
  }

  async asignarTemploPastor(pastorId: string, temploId: string): Promise<Pastor> {
    const pastorExistente = await this.pastorRepo.findById(pastorId);
    if (!pastorExistente) {
      throw new Error('Pastor no encontrado.');
    }

    pastorExistente.temploId = temploId;
    return this.pastorRepo.save(pastorExistente);
  }
}