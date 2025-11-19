import { Miembro } from '../entities/Miembro';
// Se importa el DTO desde la capa de aplicación, 
// ya que la Factory necesita saber qué datos le llegan.
import { MiembroDTO } from '../../application/dtos/MiembroDTO'; 

// Simulación de la función para generar UUID
function generateUUID(): string {
    // Aquí iría la implementación real con 'uuid/v4' o similar
    return 'uuid-' + Math.random().toString(36).substring(2, 9);
}

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
        const id = generateUUID();
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