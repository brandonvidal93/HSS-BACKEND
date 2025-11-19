import { Usuario } from "../../domain/entities/Usuario";
import { UsuarioFactory } from "../../domain/factories/UsuarioFactory";
import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";

export class GestionUsuarioService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async crearUsuario(data: {
    nombreUsuario: string,
    contrasena: string,
    temploId: string,
    miembroId?: string,
    pastorId?: string,
  }): Promise<Usuario> {
    // 1. Regla de Unicidad: Verificar si el nombre de usuario ya existe
    const usuarioExistente = await this.usuarioRepository.findByNombreUsuario(data.nombreUsuario);
    if (usuarioExistente) {
      throw new Error('El nombre de usuario ya está en uso.');
    }

    // 2. Creación con Factory (Rol Fijo: ADMIN)
    const nuevoUsuario = UsuarioFactory.create({
      ...data,
      rol: 'ADMIN' // Asigna el rol fijo
    });

    // 3. Persistencia
    return this.usuarioRepository.save(nuevoUsuario);
  }
}  