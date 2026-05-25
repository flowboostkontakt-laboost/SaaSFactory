// Resilient fetch for external adapters: bounded retries with exponential
// backoff on transient failures (network errors, 429, 5xx) plus a timeout.
// Non-transient responses (4xx) are returned as-is for the caller to handle.

type RetryOptions = {
  retries?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchRetry(
  url: string,
  init: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  const retries = options.retries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 400;
  const timeoutMs = options.timeoutMs ?? 60_000;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      if ((res.status === 429 || res.status >= 500) && attempt < retries) {
        await sleep(baseDelayMs * 2 ** attempt);
        continue;
      }
      return res;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(baseDelayMs * 2 ** attempt);
        continue;
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`fetchRetry failed for ${url}`);
}
