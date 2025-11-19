import { Pool, QueryResult } from 'pg';
import { DbClient } from './DbClient';
import * as dotenv from 'dotenv'; // Necesario para leer variables de entorno

// Cargar variables de entorno al inicializar este módulo
dotenv.config();

/**
 * PostgreSQLClient: Implementación concreta de DbClient usando el Pool de 'pg'.
 * Usa el patrón Singleton para asegurar que solo haya una instancia del Pool.
 */
export class PostgreSQLClient implements DbClient {
  private static instance: PostgreSQLClient;
  private pool: Pool;

  // El constructor es privado para forzar el uso del método estático getInstance()
  private constructor() {
    // Configuramos la conexión a PostgreSQL usando variables de entorno
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432'),
      max: 20, // Máximo de 20 clientes activos en el pool
      idleTimeoutMillis: 30000,
    });

    // Evento para verificar la conexión inicial
    this.pool.on('error', () => {
      console.error('Unexpected error on idle PostgreSQL client');
      process.exit(-1); // Salir con un código de error
    });

    console.log('PostgreSQLClient initialized with connection pool.');
  }

  /**
   * Devuelve la única instancia de PostgreSQLClient (Singleton).
   */
  public static getInstance(): PostgreSQLClient {
    if (!PostgreSQLClient.instance) {
      PostgreSQLClient.instance = new PostgreSQLClient();
    }
    return PostgreSQLClient.instance;
  }

  /**
     * Implementación del método query del contrato DbClient.
     * Utiliza el pool para ejecutar la consulta.
     */
  public async query(sql: string, params: any[] = []): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const result: QueryResult = await client.query(sql, params);
      return result.rows; // Devolvemos solo las filas
    } catch (error) {
      console.error('Error ejecutando la consulta:', sql, error);
      // Propagamos el error para que la Capa de Aplicación pueda manejarlo

      let errorMessage = 'Error desconocido en la consulta a DB.';
      
      if (error instanceof Error) {
        // Si sabemos que es un Error (el caso más común con 'pg'), usamos su mensaje.
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        // Si es una cadena, la usamos directamente.
        errorMessage = error;
      }

      // Propagamos el error al Servicio de Aplicación (la capa superior).
      throw new Error(`Error en la consulta a DB: ${errorMessage}`);
    } finally {
      // Es vital liberar el cliente del pool
      client.release();
    }
  }

  /**
   * Método de cierre, útil al finalizar la aplicación.
   */
  public async end(): Promise<void> {
    await this.pool.end();
    console.log('PostgreSQL Pool cerrado.');
  }
}
