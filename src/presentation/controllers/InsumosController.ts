import { Request, Response } from 'express';
import { DomainError } from '../../domain/errors/DomainError';
import { CalcularInsumosInputDTO } from '../../application/dtos/CalcularInsumosDTO';
import { CalcularInsumosUseCase } from '../../application/use-cases/calcular-insumos/CalcularInsumosUseCase';

export class InsumosController {
  private readonly useCase: CalcularInsumosUseCase;

  constructor() {
    this.useCase = new CalcularInsumosUseCase();
  }

  // ─── POST /api/insumos/calcular ──────────────────────────────────────────────

  calcular = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = this.parseBody(req.body);
      
      const resultado = await this.useCase.execute(input);

      res.status(200).json({
        success: true,
        data: resultado,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  // ─── Parsing e validação da request ──────────────────────────────────────────

  private parseBody(body: unknown): CalcularInsumosInputDTO {
    if (typeof body !== 'object' || body === null) {
      throw new ValidationError('O corpo da requisição deve ser um objeto JSON.');
    }

    const {
      comprimento,
      altura,
      tipoPlaca,
      faces,
      espacamentoMontantes,
    } = body as Record<string, unknown>;

    const camposFaltando = (
      [
        ['comprimento', comprimento],
        ['altura', altura],
        ['tipoPlaca', tipoPlaca],
        ['faces', faces],
        ['espacamentoMontantes', espacamentoMontantes],
      ] as [string, unknown][]
    )
      .filter(([, v]) => v === undefined || v === null)
      .map(([k]) => k);

    if (camposFaltando.length > 0) {
      throw new ValidationError(
        `Campos obrigatórios ausentes: ${camposFaltando.join(', ')}.`,
      );
    }

    return {
      comprimento: Number(comprimento),
      altura: Number(altura),
      tipoPlaca: String(tipoPlaca) as CalcularInsumosInputDTO['tipoPlaca'],
      faces: Number(faces) as CalcularInsumosInputDTO['faces'],
      espacamentoMontantes: Number(
        espacamentoMontantes,
      ) as CalcularInsumosInputDTO['espacamentoMontantes'],
    };
  }

  // ─── Tratamento de erros ──────────────────────────────────────────────────────

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        error: { type: 'VALIDATION_ERROR', message: error.message },
      });
      return;
    }

    if (error instanceof DomainError) {
      res.status(422).json({
        success: false,
        error: { type: 'DOMAIN_ERROR', message: error.message },
      });
      return;
    }

    console.error('[InsumosController] Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Ocorreu um erro interno. Tente novamente.',
      },
    });
  }
}

// ─── Erro de validação de entrada (camada de apresentação) ───────────────────

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}