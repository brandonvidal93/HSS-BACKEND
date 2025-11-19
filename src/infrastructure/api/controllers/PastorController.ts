import {Router, Request, Response} from "express";
import {GestionPastorService} from "../../../application/services/GestionPastorService";
import {PastorDTO} from "../../../application/dtos/PastorDTO";

/**
 * PastorController: Capa de Presentación. 
 * Maneja las peticiones HTTP y usa la Capa de Aplicación.
 */
export class PastorController {
  public router: Router;

  constructor(private pastorService: GestionPastorService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/pastores", this.savePastor.bind(this));
    this.router.get("/pastores", this.getAllPastores.bind(this));
    this.router.get("/pastores/:id", this.getPastorById.bind(this));
    this.router.put("/pastores/:id", this.updatePastor.bind(this));
    this.router.delete("/pastores/:id", this.deletePastor.bind(this));
    this.router.put("/:id/asignar-templo", this.asignarTemploPastor.bind(this));
  }

  private async getPastorById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const pastor = await this.pastorService.findById(id);

      if (!pastor) {
        return res.status(404).json({message: "Pastor no encontrado."});
      }

      return res.status(200).json(pastor);
    } catch (error) {
      return res.status(500).json({error: "Error al obtener pastor."});
    }
  }

  private async getAllPastores(req: Request, res: Response) {
    try {
      const pastores = await this.pastorService.findAll();
      return res.status(200).json(pastores);
    } catch (error) {
      return res.status(500).json({error: "Error al obtener pastores."});
    }
  }

  private async savePastor(req: Request, res: Response) {
    try {
      const pastorDto: PastorDTO = req.body;
      const nuevoPastor = await this.pastorService.save(pastorDto);
      return res.status(201).json({
        message: "Pastor creado exitosamente.",
        data: nuevoPastor,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear pastor.";
      return res.status(500).json({error: errorMessage});
    }
  }

  private async updatePastor(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const pastorDto: PastorDTO = req.body;
      const pastorActualizado = await this.pastorService.update(id, pastorDto);

      if (!pastorActualizado) {
        return res.status(404).json({message: "Pastor no encontrado."});
      }

      return res.status(200).json({
        message: "Pastor actualizado exitosamente.",
        data: pastorActualizado,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar pastor.";
      return res.status(500).json({error: errorMessage});
    }
  }

  private async deletePastor(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const eliminado = await this.pastorService.delete(id);

      if (!eliminado) {
        return res.status(404).json({message: "Pastor no encontrado."});
      }

      return res.status(200).json({message: "Pastor eliminado exitosamente."});
    } catch (error) {
      return res.status(500).json({error: "Error al eliminar pastor."});
    }
  }

  private async asignarTemploPastor(req: Request, res: Response) {
    try {
      const pastorId = req.params.id;
      const { temploId } = req.body;

      const pastorActualizado = await this.pastorService.asignarTemploPastor(pastorId, temploId);

      return res.status(200).json({
        message: "Templo asignado al pastor exitosamente.",
        data: pastorActualizado,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al asignar templo al pastor.";
      return res.status(500).json({ error: errorMessage });
    }
  }
}