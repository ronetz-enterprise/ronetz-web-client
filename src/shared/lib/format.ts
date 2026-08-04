// Generic display formatting helpers shared across domain modules.

export function formatDuration(minutes: number): string {
  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    return `${days} jour${days > 1 ? "s" : ""}`;
  }
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h} h`;
  }
  return `${minutes} min`;
}

export function formatData(mb: number): string {
  if (mb >= 1000) {
    const gb = mb / 1000;
    return `${Number.isInteger(gb) ? gb : gb.toFixed(1)} Go`;
  }
  return `${mb} Mo`;
}

export function formatBytes(bytes: number): string {
  return formatData(bytes / (1024 * 1024));
}

export function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${new Intl.NumberFormat("fr-FR").format(amount)} ${currency}`;
  }
}
