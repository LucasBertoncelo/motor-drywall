import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrecosController {
  // Tática de Leitura: Busca os preços atuais do banco
  listar = async (req: Request, res: Response): Promise<void> => {
    try {
      const precos = await prisma.insumoPreco.findMany();
      res.status(200).json({ success: true, data: precos });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao acessar o cofre de preços.' });
    }
  };

  // Tática de Atualização: Grava o novo preço que o cliente digitar
  atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { chaveInsumo, precoUnitario } = req.body;
      
      await prisma.insumoPreco.updateMany({
        where: { chaveInsumo: String(chaveInsumo) },
        data: { precoUnitario: Number(precoUnitario) },
      });

      res.status(200).json({ success: true, message: 'Preço atualizado com sucesso.' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao atualizar o preço.' });
    }
  };
}