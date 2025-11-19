import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Genera el hash de una contraseña dada.
 * Esta función debe ser usada por el UsuarioFactory antes de persistir la entidad.
 * @param password La contraseña en texto plano.
 * @returns El hash de la contraseña.
 */

export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
};

/**
 * Compara una contraseña en texto plano con un hash almacenado.
 * Esta función es crucial para el proceso de inicio de sesión (que idealmente haría Auth0,
 * pero se mantiene para la verificación de credenciales locales si fuera necesario).
 * @param password La contraseña en texto plano ingresada por el usuario.
 * @param hash El hash almacenado en la base de datos.
 * @returns true si coinciden, false en caso contrario.
 */
export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};