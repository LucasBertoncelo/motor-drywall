import { ParedeDrywall } from '../entities/ParedeDrywall';

export interface ResultadoInsumos {
  placas: number;
  montantes: number;
  guias: number;
  parafusos: number;
  massaKg: number;
  fitaM: number;
}

export interface IInsumosRepository {
  calcular(parede: ParedeDrywall): Promise<ResultadoInsumos>;
}
