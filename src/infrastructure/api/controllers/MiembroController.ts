import { Router, Request, Response } from 'express';
import { GestionMiembroService } from '../../../application/services/GestionMiembroService';
import { MiembroDTO } from '../../../application/dtos/MiembroDTO';

/**
 * MiembroController: Capa de Presentación. 
 * Maneja las peticiones HTTP y usa la Capa de Aplicación.
 */
export class MiembroController {
  public router: Router;

  // Inyectamos el servicio de Aplicación (Lógica de Negocio)
  constructor(private miembroService: GestionMiembroService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/miembros', this.saveMiembro.bind(this));
    this.router.get('/miembros', this.getAllMiembros.bind(this));
    this.router.get('/miembros/:id', this.getMiembroById.bind(this));
    this.router.put('/miembros/:id', this.updateMiembro.bind(this));
    this.router.delete('/miembros/:id', this.eliminarMiembro.bind(this));
    this.router.put('/:id/asignar-templo', this.asignarTemploAMiembro.bind(this));
  }

  // Manejador del POST para registrar un nuevo miembro
  private async saveMiembro(req: Request, res: Response) {
    try {
      // 1. Recibir y tipar el DTO (Capa de Presentación)
      const miembroDto: MiembroDTO = req.body;

      // 2. Ejecutar la Lógica de Negocio (Capa de Aplicación)
      const nuevoMiembro = await this.miembroService.registrarMiembro(miembroDto);

      // 3. Responder al cliente
      return res.status(201).json({
        message: 'Miembro registrado exitosamente.',
        data: nuevoMiembro
      });

    } catch (error) {
      // Manejo de errores de negocio y corrección del error 'error' is of type 'unknown'
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en el registro.';
      const statusCode = errorMessage.includes('registrado') ? 409 : 500;
      return res.status(statusCode).json({ error: errorMessage });
    }
  }

  // Manejador del GET para obtener un miembro por ID
  private getMiembroById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const miembro = await this.miembroService.getMiembroById(id);

      if (!miembro) {
        return res.status(404).json({ message: 'Miembro no encontrado.' });
      }

      return res.status(200).json(miembro);
    } catch (error) {
      // Mensaje de error genérico. Si la lógica de negocio devuelve errores específicos, 
      return res.status(500).json({ error: 'Error al obtener miembro.' });
    }
  }

  // Manejador del GET para obtener todos los miembros
  private getAllMiembros = async (req: Request, res: Response) => {
    try {
      const miembros = await this.miembroService.getAllMiembros();
      return res.status(200).json(miembros);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener miembros.' });
    }
  }

  // Manejador del PUT para actualizar un miembro
  private updateMiembro = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data: Partial<MiembroDTO> = req.body;

      const miembroActualizado = await this.miembroService.updateMiembro(id, data);
      return res.status(200).json(miembroActualizado);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en la actualización.';
      const statusCode = errorMessage.includes('no encontrado') ? 404 : 500;
      return res.status(statusCode).json({ error: errorMessage });
    }
  }

  // Manejador del DELETE para eliminar un miembro
  private eliminarMiembro = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await this.miembroService.deleteMiembro(id);
      return res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en la eliminación.';
      const statusCode = errorMessage.includes('no encontrado') ? 404 : 500;
      return res.status(statusCode).json({ error: errorMessage });
    }
  }

  private async asignarTemploAMiembro(req: Request, res: Response) {
    try {
      const miembroId = req.params.id;
      const { temploId } = req.body;

      const miembroActualizado = await this.miembroService.asignarTemploAMiembro(miembroId, temploId);

      return res.status(200).json({
        message: "Templo asignado exitosamente al miembro.",
        data: miembroActualizado,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido al asignar templo al miembro.";
      return res.status(500).json({ error: errorMessage });
    }
  }
}