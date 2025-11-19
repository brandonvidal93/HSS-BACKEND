import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";
import { comparePassword } from "../../utils/cryptoUtils";
import { LoginDTO } from "../dtos/LoginDTO";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export class AuthService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  /**
   * Valida credenciales localmente para propósitos de asignación de roles y permisos.
   * NO genera el token JWT (eso es trabajo de Auth0/IAM).
   */
  async validateUser(loginDTO: LoginDTO): Promise<boolean> {
    const usuario = await this.usuarioRepository.findByNombreUsuario(loginDTO.nombreUsuario);
    
    if (!usuario) return false;
    
    const isValidPassword = comparePassword(loginDTO.contrasena, usuario.contrasenaHash);

    if (isValidPassword) return true;

    return false;
  }

  /**
   * Obtiene el token JWT de Auth0 usando el flujo de credenciales de propietario.
   */

  async getAuth0Token(loginDTO: LoginDTO): Promise<string> {
    const isValid = await this.validateUser(loginDTO);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const tokenUrl = `${process.env.AUTH0_ISSUER_BASE_URL}oauth/token`;

    try {
      const response = await axios.post(tokenUrl, {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        username: loginDTO.nombreUsuario,
        grant_type: process.env.AUTH0_GRANT_TYPE,
        password: loginDTO.contrasena,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error al obtener token de Auth0:', error);
      throw new Error('Error en el servicio de autenticación externo.');
    }
  } 
}