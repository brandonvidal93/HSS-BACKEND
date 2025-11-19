import { auth } from 'express-oauth2-jwt-bearer';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware de Express para validar tokens JWT emitidos por Auth0.
 * Asegura que solo los clientes autenticados puedan acceder a los endpoints.
 */

export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE, // Identificador de la API
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL, // Dominio de Auth0 (ej. https://dev-xxx.us.auth0.com)
  tokenSigningAlg: 'RS256'
});