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

  async update(id: string, data: Partial<PastorDTO>): Promise<Pastor | null> {
    const pastorExistente = await this.pastorRepo.findById(id);
    if (!pastorExistente) {
      return null;
    }

    const fechaNacimiento = data.fechaNacimiento
        ? new Date(data.fechaNacimiento)
        : pastorExistente.fechaNacimiento;

    const fechaOrdenacion = data.fechaOrdenacion
        ? new Date(data.fechaOrdenacion)
        : pastorExistente.fechaOrdenacion;

    const pastorActualizado: Pastor = {
      ...pastorExistente,
      nombre: data.nombre || pastorExistente.nombre,
      apellido: data.apellido || pastorExistente.apellido,
      telefono: data.telefono || pastorExistente.telefono,
      correo: data.correo || pastorExistente.correo,
      fechaNacimiento,
      fechaOrdenacion,
      licenciaMinisterial: data.licenciaMinisterial || pastorExistente.licenciaMinisterial,
      estado: data.estado || pastorExistente.estado,
      temploId: data.temploId || pastorExistente.temploId,
    };

    if(isNaN(pastorActualizado.fechaNacimiento.getTime())) {
      throw new Error('La fecha de nacimiento proporcionada no es válida.');
    }

    if(isNaN(pastorActualizado.fechaOrdenacion.getTime())) {
      throw new Error('La fecha de ordenación proporcionada no es válida.');
    }

    return this.pastorRepo.save(pastorActualizado);
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