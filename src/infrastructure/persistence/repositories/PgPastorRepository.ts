import { Pastor } from "../../../domain/entities/Pastor";
import { PastorRepository } from "../../../domain/repositories/PastorRepository";
import { DbClient } from "../config/DbClient";

export class PgPastorRepository implements PastorRepository {
  constructor(private dbClient: DbClient) { }

  private mapRowToPastor(row: any): Pastor | null {
    if (!row) return null;
    return {
      id: row.id,
      nombre: row.nombre,
      apellido: row.apellido,
      telefono: row.telefono,
      correo: row.correo,
      fechaNacimiento: new Date(row.fecha_nacimiento),
      fechaOrdenacion: new Date(row.fecha_ordenacion),
      licenciaMinisterial: row.licencia_ministerial,
      estado: row.estado,
      temploId: row.templo_id,
    };
  }

  async findById(id: string): Promise<Pastor | null> {
    const sql = 'SELECT * FROM pastores WHERE id = $1;';
    const result = await this.dbClient.query(sql, [id]);
    return this.mapRowToPastor(result[0]);
  }

  async findAll(limit?: number, offset?: number): Promise<Pastor[]> {
    let sql = 'SELECT * FROM pastores ORDER BY nombre ASC';
    const params: any[] = [];
    if (limit !== undefined) {
      params.push(limit);
      sql += ` LIMIT $${params.length}`;
    }
    if (offset !== undefined) {
      params.push(offset);
      sql += ` OFFSET $${params.length}`;
    }
    sql += ';';

    const results = await this.dbClient.query(sql, params);
    const potentialPastores = results.map(row => this.mapRowToPastor(row));
    return potentialPastores.filter(Boolean) as Pastor[];
  }

  async save(pastor: Pastor): Promise<Pastor> {
    const sql = `
      INSERT INTO pastores (id, nombre, apellido, telefono, correo, fecha_nacimiento, fecha_ordenacion, licencia_ministerial, estado, templo_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        apellido = EXCLUDED.apellido,
        telefono = EXCLUDED.telefono,
        correo = EXCLUDED.correo,
        fecha_nacimiento = EXCLUDED.fecha_nacimiento,
        fecha_ordenacion = EXCLUDED.fecha_ordenacion,
        licencia_ministerial = EXCLUDED.licencia_ministerial,
        estado = EXCLUDED.estado,
        templo_id = EXCLUDED.templo_id
      RETURNING *;
    `;
    const params = [
      pastor.id,
      pastor.nombre,
      pastor.apellido,
      pastor.telefono,
      pastor.correo,
      pastor.fechaNacimiento,
      pastor.fechaOrdenacion,
      pastor.licenciaMinisterial,
      pastor.estado,
      pastor.temploId,
    ];
    const result = await this.dbClient.query(sql, params);
    return this.mapRowToPastor(result[0]) as Pastor;
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM pastores WHERE id = $1;';
    await this.dbClient.query(sql, [id]);
    return true;
  }

  async findPastoresByTemplo(temploId: string): Promise<Pastor[]> {
    const sql = 'SELECT * FROM pastores WHERE templo_id = $1;';
    const result = await this.dbClient.query(sql, [temploId]);
    return result.map(row => this.mapRowToPastor(row)).filter(Boolean) as Pastor[];
  }
}