import { TipoPlaca, Faces, EspacamentoMontantes } from '../../domain/entities/ParedeDrywall';

export interface CalcularInsumosInputDTO {
  comprimento: number;
  altura: number;
  tipoPlaca: TipoPlaca;
  faces: Faces;
  espacamentoMontantes: EspacamentoMontantes;
}

export interface CalcularInsumosOutputDTO {
  parede: {
    comprimento: number;
    altura: number;
    area: number;
    tipoPlaca: TipoPlaca;
    faces: Faces;
    espacamentoMontantes: EspacamentoMontantes;
  };
  insumos: {
    areaTotal: number;
    qtdPlacas: number;
    qtdGuias: number;
    qtdMontantes: number;
    qtdParafusos: number;
    custoTotal: number;
  };
}