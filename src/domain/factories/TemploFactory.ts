import { Templo } from "../entities/Templo";
import { TemploDTO } from "../../application/dtos/TemploDTO";

function generateUUID(): string {
  return 'uuid-' + Math.random().toString(36).substring(2, 9);
}

export class TemploFactory {
  static create(dto: TemploDTO): Templo {
    const id = generateUUID();

    // Se podrían añadir reglas de validación de negocio aquí
    if (!dto.nombre || !dto.direccion) {
      throw new Error('Nombre y dirección son requeridos para crear un templo.');
    }

    return {
      id: id,
      nombre: dto.nombre,
      direccion: dto.direccion,
      ciudad: dto.ciudad,
      departamento: dto.departamento,
      pais: dto.pais,
      pastorPrincipalId: dto.pastorPrincipalId,
      fechaFundacion: new Date(dto.fechaFundacion),
    };
  }
}