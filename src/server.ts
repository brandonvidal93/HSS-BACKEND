import { PostgreSQLClient } from './infrastructure/persistence/config/PostgreSQLClient';
import { PgMiembroRepository } from './infrastructure/persistence/repositories/PgMiembroRepository';
import { GestionMiembroService } from './application/services/GestionMiembroService';

// 1. Obtener la instancia Singleton del cliente de DB
const dbClient = PostgreSQLClient.getInstance();

// 2. Crear la implementación concreta del Repositorio, inyectando el DbClient
const miembroRepository = new PgMiembroRepository(dbClient);

// 3. Crear el Servicio, inyectando la interfaz del Repositorio (Principio D)
const gestionMiembroService = new GestionMiembroService(miembroRepository);

// // Ejemplo de uso del servicio para registrar un nuevo miembro
// async function main() {
//   try {
//     const nuevoMiembroData = {
//       id: 'miembro-123',
//       nombres: 'Juan',
//       apellidos: 'Pérez',
//       fechaNacimiento: new Date('1990-05-15'),
//       telefono: '555-1234',
//       email: 'IhTl0@example.com',
//       estado: 'PENDIENTE',
//       fechaRegistro: new Date(),
//       temploId: 'templo-001',
//     };

//     const miembroRegistrado = await gestionMiembroService.registrarMiembro(nuevoMiembroData);
//     console.log('Miembro registrado exitosamente:', miembroRegistrado);
//   } catch (error) {
//     console.error('Error registrando el miembro:', error.message);
//   }
// }

// main();