import { Pastor } from "../entities/Pastor";
import { PastorDTO } from "../../application/dtos/PastorDTO";

function generateUUID(): string {
  return 'uuid-' + Math.random().toString(36).substring(2, 9);
}

export class PastorFactory {
  static create(dto: PastorDTO): Pastor {
    const id = generateUUID();

    // Se podrían añadir reglas de validación de negocio aquí
    if (!dto.nombre || !dto.apellido) {
      throw new Error('Nombre y apellido son requeridos para crear un pastor.');
    }

    return {
      id: id,
      nombre: dto.nombre,
      apellido: dto.apellido,
      telefono: dto.telefono,
      correo: dto.correo,
      fechaNacimiento: new Date(dto.fechaNacimiento),
      fechaOrdenacion: new Date(dto.fechaOrdenacion),
      licenciaMinisterial: dto.licenciaMinisterial,
      estado: dto.estado,
      temploId: dto.temploId,
    };
  }
}