// /src/infrastructure/persistence/repositories/PgTemploRepository.ts

import { Templo } from '../../../domain/entities/Templo';
import { TemploRepository } from '../../../domain/repositories/TemploRepository';
import { DbClient } from '../config/DbClient';

export class PgTemploRepository implements TemploRepository {
  constructor(private dbClient: DbClient) { }

  private mapRowToTemplo(row: any): Templo | null {
    if (!row) return null;
    return {
      id: row.id,
      nombre: row.nombre,
      direccion: row.direccion,
      ciudad: row.ciudad,
      departamento: row.departamento,
      pais: row.pais,
      pastorPrincipalId: row.pastor_principal_id,
      fechaFundacion: new Date(row.fecha_fundacion),
    };
  }

  async findById(id: string): Promise<Templo | null> {
    const sql = 'SELECT * FROM templos WHERE id = $1;';
    const result = await this.dbClient.query(sql, [id]);
    return this.mapRowToTemplo(result[0]);
  }

  async findAll(): Promise<Templo[]> {
    const sql = 'SELECT * FROM templos ORDER BY nombre ASC;';
    const results = await this.dbClient.query(sql, []);
    const potentialTemplos = results.map(row => this.mapRowToTemplo(row));
    return potentialTemplos.filter(Boolean) as Templo[];
  }

  async save(templo: Templo): Promise<Templo> {
    const sql = `
      INSERT INTO templos (id, nombre, direccion, ciudad, departamento, pais, pastor_principal_id, fecha_fundacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        direccion = EXCLUDED.direccion,
        ciudad = EXCLUDED.ciudad,
        departamento = EXCLUDED.departamento,
        pais = EXCLUDED.pais,
        pastor_principal_id = EXCLUDED.pastor_principal_id
      RETURNING *;
    `;
    const params = [
      templo.id,
      templo.nombre,
      templo.direccion,
      templo.ciudad,
      templo.departamento,
      templo.pais,
      templo.pastorPrincipalId,
      templo.fechaFundacion,
    ];
    const result = await this.dbClient.query(sql, params);
    return this.mapRowToTemplo(result[0]) as Templo;
  }

  async update(id: string, templo: Templo): Promise<Templo> {
    const sql = `
      UPDATE templos
      SET nombre = $2, direccion = $3, ciudad = $4, departamento = $5, pais = $6, pastor_principal_id = $7, fecha_fundacion = $8
      WHERE id = $1
      RETURNING *;
    `;
    const params = [
      id,
      templo.nombre,
      templo.direccion,
      templo.ciudad,
      templo.departamento,
      templo.pais,
      templo.pastorPrincipalId,
      templo.fechaFundacion,
    ];
    const result = await this.dbClient.query(sql, params);
    return this.mapRowToTemplo(result[0]) as Templo;
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM templos WHERE id = $1;';
    await this.dbClient.query(sql, [id]);
    return true;
  }
}