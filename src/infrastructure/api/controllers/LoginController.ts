import {Router, Request, Response} from 'express';
import { AuthService } from '../../../application/services/AuthService';
import { LoginDTO } from '../../../application/dtos/LoginDTO';

export class LoginController {
  public router: Router;
  
  constructor(private authService: AuthService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/login', this.login.bind(this));
  }

  private async login(req: Request, res: Response) {
    try {
      const loginDTO: LoginDTO = req.body;

      const accessToken = await this.authService.getAuth0Token(loginDTO);
      
      if (accessToken) {
        return res.status(200).json({
          success: true,
          message: 'Autenticación exitosa. Use el token para acceder a los endpoints protegidos.',
          access_token: accessToken,
          token_type: 'Bearer'
        });
      } else {
        return res.status(401).json({
          success: false,
          error: 'Nombre de usuario o contraseña incorrectos.'
        });
      }
    } catch (error) {
      console.error('Error en LoginController:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor.'
      });
    }
  }
}