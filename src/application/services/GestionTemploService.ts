import { Templo } from '../../domain/entities/Templo';
import { TemploRepository } from '../../domain/repositories/TemploRepository';
import { TemploDTO } from '../dtos/TemploDTO';
import { TemploFactory } from '../../domain/factories/TemploFactory';

export class GestionTemploService {
  constructor(private temploRepo: TemploRepository) { }

  async findById(id: string): Promise<Templo | null> {
    return this.temploRepo.findById(id);
  }

  async findAll(): Promise<Templo[]> {
    return this.temploRepo.findAll();
  }
  async save(dto: TemploDTO): Promise<Templo> {
    const nuevoTemplo = TemploFactory.create(dto);
    return this.temploRepo.save(nuevoTemplo);
  }

  async update(id: string, data: Partial<TemploDTO>): Promise<Templo | null> {
    const temploExistente = await this.temploRepo.findById(id);
    if (!temploExistente) {
      return null;
    }

    // 1. Convertir fechaFundacion de string (si existe en el DTO) a objeto Date
    const fechaFundacion = data.fechaFundacion 
        ? new Date(data.fechaFundacion) 
        : temploExistente.fechaFundacion; // Mantiene la fecha original si no se envió

    // Actualizar los campos del templo existente con los datos del DTO
    const temploActualizado: Templo = {
      ...temploExistente,
      nombre: data.nombre || temploExistente.nombre,
      direccion: data.direccion || temploExistente.direccion,
      ciudad: data.ciudad || temploExistente.ciudad,
      departamento: data.departamento || temploExistente.departamento,
      pais: data.pais || temploExistente.pais,
      pastorPrincipalId: data.pastorPrincipalId || temploExistente.pastorPrincipalId,
      fechaFundacion: fechaFundacion,
    };

    // Si la fechaFundacion resultante es inválida después de la mezcla, lanzamos un error aquí
    if (isNaN(temploActualizado.fechaFundacion.getTime())) {
         throw new Error('La fecha de fundación proporcionada no es válida.');
    }

    return this.temploRepo.save(temploActualizado);
  }

  async delete(id: string): Promise<boolean> {
    return this.temploRepo.delete(id);
  }

  // Implementación de la relación Pastor-Templo (regla de negocio 521: Un pastor puede ser asignado a más de una iglesia, pero una iglesia solo puede tener un pastor principal activo)
  async asignarPastorPrincipal(temploId: string, pastorId: string): Promise<Templo> {
    const templo = await this.temploRepo.findById(temploId);
    if (!templo) throw new Error('Templo no encontrado.');

    // Lógica de negocio de la Capa de Aplicación:
    // Aquí se podría verificar si el pastorId es un 'Pastor' o 'Líder espiritual' válido antes de asignarlo.

    templo.pastorPrincipalId = pastorId;
    return this.temploRepo.save(templo);
  }
}