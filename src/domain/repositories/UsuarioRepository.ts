import { Usuario } from "../entities/Usuario";

export interface UsuarioRepository {
  findById(id: string): Promise<Usuario | null>;
  findByNombreUsuario(nombreUsuario: string): Promise<Usuario | null>;
  findByRol(rol: string): Promise<Usuario | null>;
  findAll(): Promise<Usuario[]>;
  save(usuario: Usuario): Promise<Usuario>;
  delete(id: string): Promise<boolean>;
}