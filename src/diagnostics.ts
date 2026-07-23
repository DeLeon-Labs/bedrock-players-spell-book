export function logDevelopmentError(context: string, error: unknown): void {
  if (__DEV__) {
    console.warn(`[Player's Spell Book] ${context}: ${String(error)}`);
  }
}
