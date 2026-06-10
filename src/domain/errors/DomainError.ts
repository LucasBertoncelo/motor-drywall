export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
    // Corrige prototype chain no TypeScript quando extendemos Error
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
