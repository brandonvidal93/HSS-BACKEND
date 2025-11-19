import { Comite } from "../entities/Comite";
import { ComiteDTO } from "../../application/dtos/ComiteDTO";
import { v4 as uuidv4 } from 'uuid';

export class ComiteFactory {
  static create(dto: ComiteDTO): Comite {
    const id = uuidv4();

    // Se podrían añadir reglas de validación de negocio aquí
    if (!dto.nombre || !dto.descripcion) {
      throw new Error('Nombre y descripción son requeridos para crear un comité.');
    }

    return {
      id: id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      fechaCreacion: new Date(dto.fechaCreacion),
      liderId: dto.liderId,
      temploId: dto.temploId,
    };
  }
}