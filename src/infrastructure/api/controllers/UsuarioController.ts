import { Router, Request, Response } from 'express';
import { GestionUsuarioService } from '../../../application/services/GestionUsuarioService';

export class UsuarioController {
  public router: Router;

  constructor(private usuarioService: GestionUsuarioService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', this.crearUsuario.bind(this));
  }

  private crearUsuario = async (req: Request, res: Response) => {
    try {
      const { nombreUsuario, contrasena, miembroId, pastorId, temploId } = req.body;

      // 💡 CRÍTICO: Verifique que 'contrasena' no sea undefined antes de llamar al servicio
      if (!contrasena) {
        return res.status(400).json({ error: 'La contraseña es obligatoria.' });
      }

      const nuevoUsuario = await this.usuarioService.crearUsuario({
        nombreUsuario,
        contrasena,
        temploId,
        miembroId,
        pastorId,
      });

      const { contrasenaHash, ...usuarioSinPassword } = nuevoUsuario;
      res.status(201).json({
        message: 'Usuario creado exitosamente',
        usuario: usuarioSinPassword
      });

    } catch (error) {
      const statusCode = error instanceof Error ? 500 : 400;
      res.status(statusCode).json({ error: error instanceof Error ? error.message : 'Error al crear usuario' });
    }
  }
}