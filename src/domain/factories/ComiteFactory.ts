import { Comite } from "../entities/Comite";
import { ComiteDTO } from "../../application/dtos/ComiteDTO";

function generateUUID(): string {
  return 'uuid-' + Math.random().toString(36).substring(2, 9);
}

export class ComiteFactory {
  static create(dto: ComiteDTO): Comite {
    const id = generateUUID();

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