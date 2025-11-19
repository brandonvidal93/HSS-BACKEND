export interface Usuario {
   id: string;
   nombreUsuario: string;
   contrasenaHash: string;
   rol: 'ADMIN';
   temploId: string;
   miembroId: string;
   pastorId: string;
}