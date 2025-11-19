import { Pastor } from "../entities/Pastor";
import { PastorDTO } from "../../application/dtos/PastorDTO";
import { v4 as uuidv4 } from 'uuid';

export class PastorFactory {
  static create(dto: PastorDTO): Pastor {
    const id = uuidv4();

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