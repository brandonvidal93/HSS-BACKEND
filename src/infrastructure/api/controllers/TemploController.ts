import { Router, Request, Response } from 'express';
import { GestionTemploService } from '../../../application/services/GestionTemploService';
import { TemploDTO } from '../../../application/dtos/TemploDTO';

/**
 * TemploController: Capa de Presentación. 
 * Maneja las peticiones HTTP y usa la Capa de Aplicación.
 */
export class TemploController {
  public router: Router;

  constructor(private temploService: GestionTemploService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/templos', this.saveTemplo.bind(this));
    this.router.get('/templos', this.getAllTemplos.bind(this));
    this.router.get('/templos/:id', this.getTemploById.bind(this));
    this.router.put('/templos/:id', this.updateTemplo.bind(this));
    this.router.delete('/templos/:id', this.deleteTemplo.bind(this));
    this.router.put('/:id/asignar-pastor', this.asignarPastor);
  }

  private async getTemploById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const templo = await this.temploService.findById(id);

      if (!templo) {
        return res.status(404).json({ message: 'Templo no encontrado.' });
      }

      return res.status(200).json(templo);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener templo.' });
    }
  }

  private async getAllTemplos(req: Request, res: Response) {
    try {
      const templos = await this.temploService.findAll();
      return res.status(200).json(templos);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener templos.' });
    }
  }

  private async saveTemplo(req: Request, res: Response) {
    try {
      const temploDto: TemploDTO = req.body;
      const nuevoTemplo = await this.temploService.save(temploDto);
      return res.status(201).json({
        message: 'Templo creado exitosamente.',
        data: nuevoTemplo
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear templo.';
      return res.status(500).json({ error: errorMessage });
    }
  }

  private async updateTemplo(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const temploDto: TemploDTO = req.body;
      const temploActualizado = await this.temploService.update(id, temploDto);

      if (!temploActualizado) {
        return res.status(404).json({ message: 'Templo no encontrado para actualizar.' });
      }

      return res.status(200).json({
        message: 'Templo actualizado exitosamente.',
        data: temploActualizado
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar templo.';
      return res.status(500).json({ error: errorMessage });
    }
  }

  private async deleteTemplo(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.temploService.delete(id);
      return res.status(200).json({ message: 'Templo eliminado exitosamente.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar templo.';
      return res.status(500).json({ error: errorMessage });
    }
  }

  private asignarPastor = async (req: Request, res: Response) => {
    try {
      const { pastorId } = req.body;
      const temploId = req.params.id;

      if (!pastorId) return res.status(400).json({ error: 'pastorId es requerido.' });

      const temploActualizado = await this.temploService.asignarPastorPrincipal(temploId, pastorId);
      return res.status(200).json(temploActualizado);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al asignar pastor principal.';
      return res.status(500).json({ error: errorMessage });
    }
  }
}