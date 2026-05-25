export function formatUsdc(value: string) {
  return `${Number(value).toFixed(2)} USDC`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
