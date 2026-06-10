import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'; // <-- O rádio importado no topo
import { makeInsumosRouter } from './presentation/routes/insumos.routes';
import { makePrecosRouter } from './presentation/routes/precos.routes'; // <-- A NOVA IMPORTAÇÃO

// ─── Aplicação ────────────────────────────────────────────────────────────────

const app: Application = express();
app.use(cors());

// ─── Middlewares globais ──────────────────────────────────────────────────────

app.use(cors()); // <-- A portaria liberada ANTES de receber os dados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log simplificado de requisições (substituir por winston/pino em produção)
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Rotas ────────────────────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'drywall-insumos-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/insumos', makeInsumosRouter());
app.use('/api/precos', makePrecosRouter()); // <-- A NOVA ESTRADA FINANCEIRA

// ─── Rota não encontrada (404) ────────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      type: 'NOT_FOUND',
      message: 'Rota não encontrada.',
    },
  });
});

// ─── Handler global de erros não tratados ────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[main] Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: {
      type: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor.',
    },
  });
});

// ─── Inicialização ────────────────────────────────────────────────────────────

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('');
  console.log('  🏗️  Drywall Insumos Backend');
  console.log(`  ➜  http://${HOST}:${PORT}`);
  console.log(`  ➜  POST http://${HOST}:${PORT}/api/insumos/calcular`);
  console.log(`  ➜  GET/PUT http://${HOST}:${PORT}/api/precos`); // <-- NOVO AVISO NO TERMINAL
  console.log(`  ➜  GET  http://${HOST}:${PORT}/health`);
  console.log('');
});

export default app;