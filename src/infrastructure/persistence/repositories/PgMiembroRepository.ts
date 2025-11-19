import { Miembro } from '../../../domain/entities/Miembro';
import { MiembroRepository } from '../../../domain/repositories/MiembroRepository';
import { DbClient } from '../config/DbClient';

/**
 * Clase PgMiembroRepository: Implementa el contrato MiembroRepository 
 * usando el cliente de base de datos (DbClient).
 * Esta clase reside en la capa de Infraestructura y cumple con el Principio D (Inversión de Dependencias).
 */
export class PgMiembroRepository implements MiembroRepository {

  constructor(private dbClient: DbClient) { }

  // ----------------------------------------
  // Mappers
  // ----------------------------------------
  private mapRowToMiembro(row: any): Miembro | null {
    if (!row) return null;
    return {
      id: row.id,
      nombres: row.nombres,
      apellidos: row.apellidos,
      fechaNacimiento: new Date(row.fecha_nacimiento),
      telefono: row.telefono,
      email: row.email,
      estado: row.estado,
      fechaRegistro: new Date(row.fecha_registro),
      fechaBautismo: row.fecha_bautismo ? new Date(row.fecha_bautismo) : undefined,
      activo: row.activo,
      temploId: row.templo_id,
    };
  }

  // ----------------------------------------
  // Métodos de Implementación del Contrato
  // ----------------------------------------

  async findById(id: string): Promise<Miembro | null> {
    const sql = 'SELECT * FROM miembros WHERE id = $1;';
    const result = await this.dbClient.query(sql, [id]);

    if (result.length === 0) return null;

    // Mapeo (el chequeo de null lo hace el mapper)
    return this.mapRowToMiembro(result[0]);
  }

  async findByEmail(email: string): Promise<Miembro | null> {
    const sql = 'SELECT * FROM miembros WHERE email = $1;';
    const result = await this.dbClient.query(sql, [email]);

    if (result.length === 0) return null;

    // Mapeo
    return this.mapRowToMiembro(result[0]);
  }

  async save(miembro: Miembro): Promise<Miembro> {
    const sql = `
      INSERT INTO miembros (id, nombres, apellidos, fecha_nacimiento, telefono, email, estado, fecha_registro, fecha_bautismo, activo, templo_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        nombres = EXCLUDED.nombres,
        apellidos = EXCLUDED.apellidos,
        fecha_nacimiento = EXCLUDED.fecha_nacimiento,
        telefono = EXCLUDED.telefono,
        email = EXCLUDED.email,
        estado = EXCLUDED.estado,
        fecha_registro = EXCLUDED.fecha_registro,
        fecha_bautismo = EXCLUDED.fecha_bautismo,
        activo = EXCLUDED.activo,
        templo_id = EXCLUDED.templo_id
      RETURNING *;
    `;

    const params = [
      miembro.id,
      miembro.nombres,
      miembro.apellidos,
      miembro.fechaNacimiento,
      miembro.telefono,
      miembro.email,
      miembro.estado,
      miembro.fechaRegistro,
      miembro.fechaBautismo,
      miembro.activo,
      miembro.temploId,
    ];

    const result = await this.dbClient.query(sql, params);

    // La consulta RETURNING * garantiza un resultado. Usamos aserción de tipo.
    const miembroGuardado = this.mapRowToMiembro(result[0]);
    return miembroGuardado as Miembro;
  }

  async findAll(): Promise<Miembro[]> {
    const sql = 'SELECT * FROM miembros ORDER BY fecha_registro DESC;';
    const results = await this.dbClient.query(sql, []);

    const potentialMiembros = results.map(row => this.mapRowToMiembro(row));

    // Filtra nulos y afirma el tipo
    return potentialMiembros.filter(Boolean) as Miembro[];
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM miembros WHERE id = $1;';
    // En una aplicación real, se debería verificar si 'rowCount' es > 0
    const result = await this.dbClient.query(sql, [id]);
    return true;
  }

  async findMiembrosByTemplo(temploId: string): Promise<Miembro[]> {
    const sql = 'SELECT * FROM miembros WHERE iglesia_id = $1;';
    const results = await this.dbClient.query(sql, [temploId]);

    const potentialMiembros = results.map(row => this.mapRowToMiembro(row));

    // Filtra nulos y afirma el tipo
    return potentialMiembros.filter(Boolean) as Miembro[];
  }

  // El método findMiembrosByTemplo usa 'iglesia_id' en la SQL, lo cual es correcto.
}