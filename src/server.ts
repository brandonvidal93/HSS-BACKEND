import { UsuarioRepository } from './domain/repositories/UsuarioRepository';
import express, { Application, Router } from 'express';
import { json } from 'body-parser';
import { checkJwt } from './infrastructure/auth/authMiddleware';
import * as dotenv from 'dotenv';
import cors from 'cors';

// --- Importaciones de Infraestructura (Implementaciones Concretas) ---
import { PostgreSQLClient } from './infrastructure/persistence/config/PostgreSQLClient';
import { PgMiembroRepository } from './infrastructure/persistence/repositories/PgMiembroRepository';
import { PgTemploRepository } from './infrastructure/persistence/repositories/PgTemploRepository';
import { PgPastorRepository } from './infrastructure/persistence/repositories/PgPastorRepository';
import { PgComiteRepository } from './infrastructure/persistence/repositories/PgComiteRepository';
import { PgUsuarioRepository } from './infrastructure/persistence/repositories/PgUsuarioRepository';

// --- Importaciones de Aplicación (Servicios/Lógica de Negocio) ---
import { GestionMiembroService } from './application/services/GestionMiembroService';
import { GestionTemploService } from './application/services/GestionTemploService';
import { GestionPastorService } from './application/services/GestionPastorService';
import { GestionComiteService } from './application/services/GestionComiteService';
import { GestionUsuarioService } from './application/services/GestionUsuarioService';
import { AuthService } from './application/services/AuthService';

// --- Importaciones de Presentación (Controladores/Rutas) ---
import { MiembroController } from './infrastructure/api/controllers/MiembroController';
import { TemploController } from './infrastructure/api/controllers/TemploController';
import { PastorController } from './infrastructure/api/controllers/PastorController';
import { ComiteController } from './infrastructure/api/controllers/ComiteController';
import { UsuarioController } from './infrastructure/api/controllers/UsuarioController';
import { LoginController } from './infrastructure/api/controllers/LoginController';

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
    this.app.use(cors({
      origin: '*', // ⚠️ Temporalmente permitimos cualquier origen para desarrollo.
                    // Se recomienda cambiar esto al dominio del frontend en producción.
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'] // Importante para el JWT de Auth0
    }));

    this.app.use(json()); // Para parsear el body como JSON
    
    // 🚨 Aplicación Global del Middleware de Seguridad
    // Aplica el chequeo JWT a todas las rutas bajo /api
    // this.app.use('/api', checkJwt);

    // console.log('--- Middleware Configurado ---');
  }

  private setupDependenciesAndRoutes(): void {
    console.log('--- Configurando Inyección de Dependencias ---');

    // 1. INFRAESTRUCTURA (DB Client y Repositorios Concretos)
    const dbClient = PostgreSQLClient.getInstance();

    const miembroRepository = new PgMiembroRepository(dbClient); // Inyecta DB Client 
    const temploRepository = new PgTemploRepository(dbClient);
    const pastorRepository = new PgPastorRepository(dbClient);
    const comiteRepository = new PgComiteRepository(dbClient);
    const usuarioRepository = new PgUsuarioRepository(dbClient);
    
    // 2. APLICACIÓN (Servicios de Negocio)
    // Inyecta el CONTRATO (el repositorio implementado)
    const gestionMiembroService = new GestionMiembroService(miembroRepository);
    const gestionTemploService = new GestionTemploService(temploRepository);
    const gestionPastorService = new GestionPastorService(pastorRepository);
    const gestionComiteService = new GestionComiteService(comiteRepository);
    const gestionUsuarioService = new GestionUsuarioService(usuarioRepository);
    const authService = new AuthService(usuarioRepository);

    // 3. PRESENTACIÓN (Controladores y Rutas)
    const miembroController = new MiembroController(gestionMiembroService);
    const temploController = new TemploController(gestionTemploService);
    const pastorController = new PastorController(gestionPastorService);
    const comiteController = new ComiteController(gestionComiteService);
    const usuarioController = new UsuarioController(gestionUsuarioService);
    const loginController = new LoginController(authService);

    const publicRouter = Router();

    publicRouter.get('/', (req, res) => {
      res.status(200).json({ 
        status: 'ok', 
        message: 'HolySeeSoftware API running successfully',
        version: '1.0'
      });
    });

    // 🚨 RUTA EXCLUIDA: El POST para crear el primer ADMIN
    // Montamos el controlador de usuario que contiene la ruta /registrar-admin
    publicRouter.use('/usuarios', usuarioController.router);

    publicRouter.use('/auth', loginController.router);

    // Aplicamos las rutas públicas
    this.app.use('/api', publicRouter);

    // Aplicamos el middleware de seguridad. Este se ejecuta DESPUÉS de las rutas públicas.
    // this.app.use('/api', checkJwt);

    // Creamos un nuevo router para las rutas protegidas.
    const privateRouter = Router();
    
    privateRouter.use('/miembros', miembroController.router);
    privateRouter.use('/templos', temploController.router);
    privateRouter.use('/pastores', pastorController.router);
    privateRouter.use('/comites', comiteController.router);

    // prefijo principal para todas las rutas de la API
    this.app.use('/api', privateRouter); 

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