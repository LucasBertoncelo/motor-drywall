import { ParedeDrywall } from '../../../domain/entities/ParedeDrywall';
import { PrismaClient } from '@prisma/client';
import {
  CalcularInsumosInputDTO,
  CalcularInsumosOutputDTO,
} from '../../dtos/CalcularInsumosDTO';

// Instancia a conexão com o banco
const prisma = new PrismaClient();

interface ResultadoInsumos {
  qtdPlacas: number;
  qtdGuias: number;
  qtdMontantes: number;
  qtdParafusos: number;
  areaTotal: number;
  custoTotal: number;
}

export class CalcularInsumosUseCase {
  private static readonly AREA_PLACA_M2 = 2.88;
  private static readonly COMPRIMENTO_GUIA_M = 3;
  private static readonly ALTURA_MODULO_MONTANTE_M = 3;
  private static readonly PARAFUSOS_POR_PLACA = 25;

  async execute(input: CalcularInsumosInputDTO): Promise<CalcularInsumosOutputDTO> {
    const parede = ParedeDrywall.create({
      comprimento: input.comprimento,
      altura: input.altura,
      tipoPlaca: input.tipoPlaca,
      faces: input.faces,
      espacamentoMontantes: input.espacamentoMontantes,
    });

    // 1. O Reconhecimento: Busca os preços atualizados no banco de dados
    const precosBanco = await prisma.insumoPreco.findMany();
    
    // Tática Dinâmica: Monta o nome exato da placa com base na escolha do cliente (PLACA_ST, PLACA_RU ou PLACA_RF)
    const chavePlacaSelecionada = `PLACA_${parede.tipoPlaca}`;

    // 2. Correção Balística: As chaves exigem rigor absoluto nas letras maiúsculas
    const precos = {
      placa: precosBanco.find(p => p.chaveInsumo === chavePlacaSelecionada)?.precoUnitario || 0,
      guia: precosBanco.find(p => p.chaveInsumo === 'GUIA_U')?.precoUnitario || 0,
      montante: precosBanco.find(p => p.chaveInsumo === 'MONTANTE_C')?.precoUnitario || 0,
      parafuso: precosBanco.find(p => p.chaveInsumo === 'PARAFUSO')?.precoUnitario || 0,
    };

    const insumos = this.calcularInsumos(parede, precos);

    return {
      parede: {
        comprimento: parede.comprimento,
        altura: parede.altura,
        area: parede.area,
        tipoPlaca: parede.tipoPlaca,
        faces: parede.faces,
        espacamentoMontantes: parede.espacamentoMontantes,
      },
      insumos,
    };
  }

  private calcularInsumos(parede: ParedeDrywall, precos: any): ResultadoInsumos {
    const areaTotal = this.calcularAreaTotal(parede);
    const qtdPlacas = this.calcularQtdPlacas(areaTotal);
    const qtdGuias = this.calcularQtdGuias(parede.comprimento);
    const qtdMontantes = this.calcularQtdMontantes(
      parede.comprimento,
      parede.altura,
      parede.espacamentoMontantes,
    );
    const qtdParafusos = this.calcularQtdParafusos(qtdPlacas);

    const custoPlacas = qtdPlacas * precos.placa;
    const custoGuias = qtdGuias * precos.guia;
    const custoMontantes = qtdMontantes * precos.montante;
    const custoParafusos = qtdParafusos * precos.parafuso;

    const custoTotal = custoPlacas + custoGuias + custoMontantes + custoParafusos;

    return { areaTotal, qtdPlacas, qtdGuias, qtdMontantes, qtdParafusos, custoTotal };
  }

  private calcularAreaTotal(parede: ParedeDrywall): number {
    return parede.comprimento * parede.altura * parede.faces;
  }

  private calcularQtdPlacas(areaTotal: number): number {
    return Math.ceil(areaTotal / CalcularInsumosUseCase.AREA_PLACA_M2);
  }

  private calcularQtdGuias(comprimento: number): number {
    return Math.ceil((comprimento * 2) / CalcularInsumosUseCase.COMPRIMENTO_GUIA_M);
  }

  private calcularQtdMontantes(
    comprimento: number,
    altura: number,
    espacamentoMontantesCm: number,
  ): number {
    const espacamentoM = espacamentoMontantesCm / 100;
    const montantesHorizontais = Math.ceil(comprimento / espacamentoM) + 1;
    const modulosVerticais = Math.ceil(altura / CalcularInsumosUseCase.ALTURA_MODULO_MONTANTE_M);
    return montantesHorizontais * modulosVerticais;
  }

  private calcularQtdParafusos(qtdPlacas: number): number {
    return qtdPlacas * CalcularInsumosUseCase.PARAFUSOS_POR_PLACA;
  }
}