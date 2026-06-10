import { Router } from 'express';
import { InsumosController } from '../controllers/InsumosController';

/**
 * Rotas do módulo de Insumos.
 *
 * Base path (registado no main.ts): /api/insumos
 *
 * POST /api/insumos/calcular
 *   Body: { comprimento, altura, tipoPlaca, faces, espacamentoMontantes }
 *   Response 200: { success: true, data: { parede, insumos } }
 *   Response 400: { success: false, error: { type: 'VALIDATION_ERROR', message } }
 *   Response 422: { success: false, error: { type: 'DOMAIN_ERROR', message } }
 *   Response 500: { success: false, error: { type: 'INTERNAL_ERROR', message } }
 */
export function makeInsumosRouter(): Router {
  const router = Router();
  const controller = new InsumosController();

  router.post('/calcular', controller.calcular);

  return router;
}
