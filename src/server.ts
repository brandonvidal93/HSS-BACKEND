import express, { Application, Router } from 'express';
import * as dotenv from 'dotenv';
import { json } from 'body-parser';

// --- Importaciones de Infraestructura (Implementaciones Concretas) ---
import { PostgreSQLClient } from './infrastructure/persistence/config/PostgreSQLClient';
import { PgMiembroRepository } from './infrastructure/persistence/repositories/PgMiembroRepository';

// --- Importaciones de Aplicación (Servicios/Lógica de Negocio) ---
import { GestionMiembroService } from './application/services/GestionMiembroService';

// --- Importaciones de Presentación (Controladores/Rutas) ---
import { MiembroController } from './infrastructure/api/controllers/MiembroController';

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
class App {
  public app: Application;
  private port = process.env.PORT || 3000;
  
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupDependenciesAndRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(json()); // Para parsear el body como JSON
    // Aquí iría el middleware de Auth0 (JWT) para asegurar las rutas
    // this.app.use(authMiddleware); 
  }

  private setupDependenciesAndRoutes(): void {
    console.log('--- Configurando Inyección de Dependencias ---');

    // 1. INFRAESTRUCTURA (DB Client y Repositorios Concretos)
    const dbClient = PostgreSQLClient.getInstance();
    const miembroRepository = new PgMiembroRepository(dbClient); // Inyecta DB Client 

    // 2. APLICACIÓN (Servicios de Negocio)
    // Inyecta el CONTRATO (el repositorio implementado)
    const gestionMiembroService = new GestionMiembroService(miembroRepository);

    // 3. PRESENTACIÓN (Controladores y Rutas)
    const miembroController = new MiembroController(gestionMiembroService);

    // Configración de ruta base para miembros
    const router = Router();
    router.use('/miembros', miembroController.router);

    // prefijo principal para todas las rutas de la API
    this.app.use('/api', router); 

    console.log('--- Inyección de Dependencias Configurada ---');
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor HolySeeSoftware corriendo en http://localhost:${this.port}/api`);
    });
  }
}

// Iniciar la aplicación
const app = new App();
app.start();