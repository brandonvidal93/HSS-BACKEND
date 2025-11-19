import { Usuario } from "../entities/Usuario";
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from "../../utils/cryptoUtils";


export class UsuarioFactory {
  static create(data: {
    nombreUsuario: string;
    contrasena: string;
    rol: Usuario['rol'];
    temploId: string;
    miembroId?: string;
    pastorId?: string;
  }): Usuario {
    // reglas de validación
    if (data.contrasena.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }
    
    const hashedPassword = hashPassword(data.contrasena);

    return {
      id: uuidv4(),
      nombreUsuario: data.nombreUsuario,
      contrasenaHash: hashedPassword,
      rol: data.rol,
      temploId: data.temploId,
      miembroId: data.miembroId || '',
      pastorId: data.pastorId || '',
    };
  }
}