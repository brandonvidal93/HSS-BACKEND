import { Miembro } from '../entities/Miembro';
import { MiembroDTO } from '../../application/dtos/MiembroDTO';
import { v4 as uuidv4 } from 'uuid';

export class MiembroFactory {
  /**
   * Crea una instancia de la entidad Miembro a partir del DTO.
   * Aplica reglas de construcción iniciales y genera datos internos.
   */
  static create(dto: MiembroDTO): Miembro {
    // // Validación de construcción: ejemplo de regla de negocio
    // if (new Date().getFullYear() - new Date(dto.fechaNacimiento).getFullYear() < 18) {
    //      // La Fábrica puede lanzar errores si no se cumplen las reglas de creación
    //      throw new Error('El miembro debe ser mayor de 18 años para el registro principal.');
    // }

    // Generar el ID y asignar valores por defecto
    const id = uuidv4();
    const fechaRegistro = new Date();

    return {
      id: id,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      fechaNacimiento: new Date(dto.fechaNacimiento),
      telefono: dto.telefono,
      email: dto.email,
      estado: 'NO_ASOCIADO', // Estado inicial por defecto
      fechaRegistro: fechaRegistro,
      fechaBautismo: dto.fechaBautismo,
      activo: true, // Activo por defecto
      temploId: dto.temploId,
    };
  }
}