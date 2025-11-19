import { Router, Request, Response } from "express";
import { GestionComiteService } from "../../../application/services/GestionComiteService";
import { ComiteDTO } from "../../../application/dtos/ComiteDTO";

/**
 * ComiteController: Capa de Presentación. 
 * Maneja las peticiones HTTP y usa la Capa de Aplicación.
 */
export class ComiteController {
  public router: Router;

  constructor(private comiteService: GestionComiteService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.saveComite.bind(this));
    this.router.get("/", this.getAllComites.bind(this));
    this.router.get("/:id", this.getComiteById.bind(this));
    this.router.put("/:id", this.updateComite.bind(this));
    this.router.delete("/:id", this.deleteComite.bind(this));
    this.router.put("/:id/asignar-lider", this.asignarLiderComite);
    this.router.put("/:id/asignar-templo", this.asignarTemploComite);
  }

  private async getComiteById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const comite = await this.comiteService.findById(id);

      if (!comite) {
        return res.status(404).json({ message: "Comité no encontrado." });
      }

      return res.status(200).json(comite);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener comité." });
    }
  }

  private async getAllComites(req: Request, res: Response) {
    try {
      const comites = await this.comiteService.findAll();
      return res.status(200).json(comites);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener comités." });
    }
  }

  private async saveComite(req: Request, res: Response) {
    try {
      const comiteDto: ComiteDTO = req.body;
      const nuevoComite = await this.comiteService.save(comiteDto);
      return res.status(201).json({
        message: "Comité creado exitosamente.",
        data: nuevoComite,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido al crear comité.";
      return res.status(500).json({ error: errorMessage });
    }
  }

  private async updateComite(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const comiteDto: ComiteDTO = req.body;
      const comiteActualizado = await this.comiteService.update(id, comiteDto);

      if (!comiteActualizado) {
        return res.status(404).json({ message: "Comité no encontrado para actualizar." });
      }

      return res.status(200).json({
        message: "Comité actualizado exitosamente.",
        data: comiteActualizado,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido al actualizar comité.";
      return res.status(500).json({ error: errorMessage });
    }
  }

  private async deleteComite(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exito = await this.comiteService.delete(id);

      if (!exito) {
        return res.status(404).json({ message: "Comité no encontrado para eliminar." });
      }

      return res.status(200).json({ message: "Comité eliminado exitosamente." });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar comité." });
    }
  }

  private async asignarLiderComite(req: Request, res: Response) {
    try {
      const comiteId = req.params.id;
      const { liderId } = req.body;

      const comiteActualizado = await this.comiteService.asignarLiderComite(comiteId, liderId);

      return res.status(200).json({
        message: "Líder asignado exitosamente al comité.",
        data: comiteActualizado,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido al asignar líder al comité.";
      return res.status(500).json({ error: errorMessage });
    }
  }

  private async asignarTemploComite(req: Request, res: Response) {
    try {
      const comiteId = req.params.id;
      const { temploId } = req.body;

      const comiteActualizado = await this.comiteService.asignarTemploComite(comiteId, temploId);

      return res.status(200).json({
        message: "Templo asignado exitosamente al comité.",
        data: comiteActualizado,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido al asignar templo al comité.";
      return res.status(500).json({ error: errorMessage });
    }
  }
}