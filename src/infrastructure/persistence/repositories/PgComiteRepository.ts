import { Comite } from "../../../domain/entities/Comite";
import { ComiteRepository } from "../../../domain/repositories/ComiteRepository";
import { DbClient } from "../config/DbClient";

export class PgComiteRepository implements ComiteRepository {
  constructor(private dbClient: DbClient) { }

  private mapRowToComite(row: any): Comite | null {
    if (!row) return null;
    return {
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      fechaCreacion: new Date(row.fecha_creacion),
      liderId: row.lider_id,
      temploId: row.templo_id,
    };
  }

  async findById(id: string): Promise<Comite | null> {
    const sql = 'SELECT * FROM comites WHERE id = $1;';
    const result = await this.dbClient.query(sql, [id]);
    return this.mapRowToComite(result[0]);
  }

  async findAll(): Promise<Comite[]> {
    const sql = 'SELECT * FROM comites ORDER BY nombre ASC;';
    const results = await this.dbClient.query(sql, []);
    const potentialComites = results.map(row => this.mapRowToComite(row));
    return potentialComites.filter(Boolean) as Comite[];
  }

  async save(comite: Comite): Promise<Comite> {
    const sql = `
      INSERT INTO comites (id, nombre, descripcion, fecha_creacion, lider_id, templo_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        fecha_creacion = EXCLUDED.fecha_creacion,
        lider_id = EXCLUDED.lider_id,
        templo_id = EXCLUDED.templo_id
      RETURNING *;
    `;
    const params = [
      comite.id,
      comite.nombre,
      comite.descripcion,
      comite.fechaCreacion,
      comite.liderId,
      comite.temploId,
    ];
    const result = await this.dbClient.query(sql, params);
    return this.mapRowToComite(result[0]) as Comite;
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM comites WHERE id = $1;';
    const result = await this.dbClient.query(sql, [id]);
    return true;
  }

  async findComitesByTemplo(temploId: string): Promise<Comite[]> {
    const sql = 'SELECT * FROM comites WHERE templo_id = $1 ORDER BY nombre ASC;';
    const results = await this.dbClient.query(sql, [temploId]);
    const potentialComites = results.map(row => this.mapRowToComite(row));
    return potentialComites.filter(Boolean) as Comite[];
  }
}