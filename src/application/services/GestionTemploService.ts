import { Templo } from '../../domain/entities/Templo';
import { TemploRepository } from '../../domain/repositories/TemploRepository';
import { TemploDTO } from '../dtos/TemploDTO';
import { TemploFactory } from '../../domain/factories/TemploFactory';

export class GestionTemploService {
  constructor(private temploRepo: TemploRepository) {}

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

  async update(id: string, dto: TemploDTO): Promise<Templo | null> {
    const temploExistente = await this.temploRepo.findById(id);
    if (!temploExistente) {
      return null;
    }

    // Actualizar los campos del templo existente con los datos del DTO
    temploExistente.nombre = dto.nombre;
    temploExistente.direccion = dto.direccion;
    temploExistente.ciudad = dto.ciudad;
    temploExistente.departamento = dto.departamento;
    temploExistente.pais = dto.pais;
    temploExistente.pastorPrincipalId = dto.pastorPrincipalId;
    temploExistente.fechaFundacion = new Date(dto.fechaFundacion);

    return this.temploRepo.save(temploExistente);
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