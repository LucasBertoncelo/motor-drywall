/**
 * Tipos de placa de Drywall disponíveis:
 * - ST: Standard (uso geral, ambientes secos)
 * - RU: Resistente à Umidade (áreas molhadas)
 * - RF: Resistente ao Fogo (ambientes que exigem proteção contra fogo)
 */
import { DomainError } from "../errors/DomainError";

export type TipoPlaca = 'ST' | 'RU' | 'RF';

/**
 * Número de faces revestidas da parede:
 * - 1: Revestimento simples (uma face)
 * - 2: Revestimento duplo (duas faces)
 */
export type Faces = 1 | 2;

/**
 * Espaçamento entre montantes em centímetros (modulação da estrutura metálica):
 * - 40: Modulação de 40 cm (maior rigidez estrutural)
 * - 60: Modulação de 60 cm (menor consumo de perfis)
 */
export type EspacamentoMontantes = 40 | 60;

export interface ParedeDrywallProps {
  comprimento: number;           // em metros
  altura: number;                // em metros
  tipoPlaca: TipoPlaca;
  faces: Faces;
  espacamentoMontantes: EspacamentoMontantes;
}

export class ParedeDrywall {
  private readonly _comprimento: number;
  private readonly _altura: number;
  private readonly _tipoPlaca: TipoPlaca;
  private readonly _faces: Faces;
  private readonly _espacamentoMontantes: EspacamentoMontantes;

  private constructor(props: ParedeDrywallProps) {
    this._comprimento = props.comprimento;
    this._altura = props.altura;
    this._tipoPlaca = props.tipoPlaca;
    this._faces = props.faces;
    this._espacamentoMontantes = props.espacamentoMontantes;
  }

  // ─── Factory Method ─────────────────────────────────────────────────────────

  public static create(props: ParedeDrywallProps): ParedeDrywall {
    ParedeDrywall.validate(props);
    return new ParedeDrywall(props);
  }

  // ─── Validação de Domínio ────────────────────────────────────────────────────

  private static validate(props: ParedeDrywallProps): void {
    if (props.comprimento <= 0) {
      throw new DomainError('Comprimento deve ser maior que zero.');
    }

    if (props.altura <= 0) {
      throw new DomainError('Altura deve ser maior que zero.');
    }

    if (props.altura > 8) {
      throw new DomainError('Altura máxima permitida para parede Drywall é 8 metros.');
    }

    const tiposValidos: TipoPlaca[] = ['ST', 'RU', 'RF'];
    if (!tiposValidos.includes(props.tipoPlaca)) {
      throw new DomainError(`Tipo de placa inválido: "${props.tipoPlaca}". Use: ST, RU ou RF.`);
    }

    const facesValidas: Faces[] = [1, 2];
    if (!facesValidas.includes(props.faces)) {
      throw new DomainError(`Número de faces inválido: "${props.faces}". Use: 1 ou 2.`);
    }

    const espacamentosValidos: EspacamentoMontantes[] = [40, 60];
    if (!espacamentosValidos.includes(props.espacamentoMontantes)) {
      throw new DomainError(
        `Espaçamento de montantes inválido: "${props.espacamentoMontantes}". Use: 40 ou 60 cm.`
      );
    }
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  get comprimento(): number {
    return this._comprimento;
  }

  get altura(): number {
    return this._altura;
  }

  get tipoPlaca(): TipoPlaca {
    return this._tipoPlaca;
  }

  get faces(): Faces {
    return this._faces;
  }

  get espacamentoMontantes(): EspacamentoMontantes {
    return this._espacamentoMontantes;
  }

  // ─── Computed Properties (Regras de Domínio) ─────────────────────────────────

  /**
   * Área total da parede em m².
   */
  get area(): number {
    return parseFloat((this._comprimento * this._altura).toFixed(4));
  }

  /**
   * Área total de placa considerando o número de faces em m².
   */
  get areaPlacas(): number {
    return parseFloat((this.area * this._faces).toFixed(4));
  }

  /**
   * Perímetro da parede em metros (base + teto).
   */
  get perimetroBaseTeto(): number {
    return parseFloat((this._comprimento * 2).toFixed(4));
  }

  // ─── Serialização ────────────────────────────────────────────────────────────

  public toJSON(): ParedeDrywallProps & {
    area: number;
    areaPlacas: number;
    perimetroBaseTeto: number;
  } {
    return {
      comprimento: this._comprimento,
      altura: this._altura,
      tipoPlaca: this._tipoPlaca,
      faces: this._faces,
      espacamentoMontantes: this._espacamentoMontantes,
      area: this.area,
      areaPlacas: this.areaPlacas,
      perimetroBaseTeto: this.perimetroBaseTeto,
    };
  }
}
