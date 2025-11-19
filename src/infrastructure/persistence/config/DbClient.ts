/**
 * DbClient: Contrato para cualquier cliente de base de datos.
 * Esto permite inyectar cualquier tipo de conexión (PostgreSQL, MySQL, In-Memory)
 * en el Repositorio, sin que el Repositorio sepa el detalle.
 */

export interface DbClient {
  /**
   * Ejecuta una consulta SQL genérica.
   * @param sql La consulta SQL.
   * @param params Los parámetros para la consulta.
   * @returns Un array de resultados (filas).
   */
  query(sql: string, params: any[]): Promise<any[]>;
}