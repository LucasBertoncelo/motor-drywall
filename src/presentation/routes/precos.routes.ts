import { Router } from 'express';
import { PrecosController } from '../controllers/PrecosController';

export function makePrecosRouter(): Router {
  const router = Router();
  const controller = new PrecosController();

  // Rota para LER os preços (viaja pelo método GET)
  router.get('/', controller.listar);
  
  // Rota para SALVAR um novo preço (viaja pelo método PUT)
  router.put('/', controller.atualizar);

  return router;
}