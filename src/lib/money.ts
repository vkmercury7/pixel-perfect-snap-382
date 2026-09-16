/** Valores sempre em centavos (inteiro) para evitar erro de ponto flutuante. */
export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

/** Máscara de digitação monetária: "1358" -> "13,58" */
export function maskMoneyInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  const padded = digits.padStart(3, "0");
  const int = padded.slice(0, -2);
  const dec = padded.slice(-2);
  return `${Number(int).toLocaleString("pt-BR")},${dec}`;
}

export function moneyInputToCents(masked: string): number {
  const digits = masked.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function centsToMoneyInput(cents: number): string {
  return maskMoneyInput(String(cents));
}
