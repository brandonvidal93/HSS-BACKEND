import { Usuario } from "../../../domain/entities/Usuario";
import { UsuarioRepository } from "../../../domain/repositories/UsuarioRepository";
import { DbClient } from "../config/DbClient";

/**
 * Clase PgUsuarioRepository: Implementa el contrato UsuarioRepository 
 * usando el cliente de base de datos (DbClient).
 * Esta clase reside en la capa de Infraestructura y cumple con el Principio D (Inversión de Dependencias).
 */
export class PgUsuarioRepository implements UsuarioRepository {

  constructor(private dbClient: DbClient) { }

  // ----------------------------------------
  // Mappers
  // ----------------------------------------
  private mapRowToUsuario(row: any): Usuario | null {
    if (!row) return null;
    return {
      id: row.id,
      nombreUsuario: row.nombre_usuario,
      contrasenaHash: row.contrasena_hash,
      rol: row.rol ? row.rol.split(',') : [],
      temploId: row.templo_id,
      miembroId: row.miembro_id,
      pastorId: row.pastor_id,
    };
  }

  // ----------------------------------------
  // Métodos de Implementación del Contrato
  // ----------------------------------------

  async findById(id: string): Promise<Usuario | null> {
    const sql = 'SELECT * FROM usuarios WHERE id = $1;';
    const result = await this.dbClient.query(sql, [id]);

    if (result.length === 0) return null;

    // Mapeo (el chequeo de null lo hace el mapper)
    return this.mapRowToUsuario(result[0]);
  }

  async findByNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
    const sql = 'SELECT * FROM usuarios WHERE nombre_usuario = $1;';
    const result = await this.dbClient.query(sql, [nombreUsuario]);

    if (result.length === 0) return null;

    // Mapeo
    return this.mapRowToUsuario(result[0]);
  }

  async findByRol(rol: string): Promise<Usuario | null> {
    const sql = 'SELECT * FROM usuarios WHERE roles = $1;';
    const result = await this.dbClient.query(sql, [rol]);

    if (result.length === 0) return null;

    // Mapeo
    return this.mapRowToUsuario(result[0]);
  }

  async findAll(): Promise<Usuario[]> {
    const sql = 'SELECT * FROM usuarios;';
    const result = await this.dbClient.query(sql, []);
    return result.map(row => this.mapRowToUsuario(row)).filter(Boolean) as Usuario[];
  }

  async save(usuario: Usuario): Promise<Usuario> {
    const finalMiembroId = usuario.miembroId || null;
    const finalPastorId = usuario.pastorId || null;

    const isInsert = (await this.findByNombreUsuario(usuario.nombreUsuario)) === null;

    // 3. Parámetros compartidos (ordenados del $1 al $7)
    const params = [
      usuario.id,
      usuario.nombreUsuario,
      usuario.contrasenaHash,
      usuario.rol,
      finalMiembroId,  // $5
      finalPastorId,   // $6
      usuario.temploId,   // $7
    ];

    let query: string;

    if (isInsert) {
      // INSERT: Se crea un nuevo registro
      query = `
          INSERT INTO usuarios (id, nombre_usuario, contrasena_hash, rol, miembro_id, pastor_id, templo_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
      `;
    } else {
      // UPDATE: Se actualizan los campos para un usuario existente
      query = `
        UPDATE usuarios
        SET 
          nombre_usuario = $2, 
          contrasena_hash = $3, 
          rol = $4, 
          miembro_id = $5, 
          pastor_id = $6, 
          templo_id = $7
        WHERE id = $1
        RETURNING *
    `;
      // El orden de los parámetros es importante: $1 es el ID en la cláusula WHERE.
      params.unshift(usuario.id);
    }

    const result = await this.dbClient.query(query, params);

    // Mapeo
    return this.mapRowToUsuario(result[0]) as Usuario;
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM usuarios WHERE id = $1;';
    const result = await this.dbClient.query(sql, [id]);
    return true;
  }
}
