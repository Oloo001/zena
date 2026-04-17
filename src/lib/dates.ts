export function getDaysBetween(start: Date, end: Date): number {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatPrice(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getTodayInputValue(): string {
  return toDateInputValue(new Date());
}

export function getTomorrowInputValue(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toDateInputValue(tomorrow);
}