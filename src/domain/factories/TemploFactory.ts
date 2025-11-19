import { Templo } from "../entities/Templo";
import { TemploDTO } from "../../application/dtos/TemploDTO";
import { v4 as uuidv4 } from 'uuid';

export class TemploFactory {
  static create(dto: TemploDTO): Templo {
    // Generar el ID y asignar valores por defecto
    const id = uuidv4();

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