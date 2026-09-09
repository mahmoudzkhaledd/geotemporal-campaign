import { ZodError } from "zod";

export function toNumber(n: any) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0) ? parseFloat(n) : null;
}
export function toInt(n: any) {
  return !isNaN(parseInt(n)) && !isNaN(n - 0) ? parseInt(n) : null;
}
export async function delay(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export function extractError(ex: unknown): string {
  const DEFAULT_ERROR = "Unknown error occurred, please try again later.";
  if (ex instanceof ZodError) {
    return ex.issues[0]?.message ?? "Validation error";
  }

  if (ex instanceof Error) {
    const message = ex.message.trim();

    return message.startsWith("msg:")
      ? message.slice(4).trim() || DEFAULT_ERROR
      : message || DEFAULT_ERROR;
  }

  if (typeof ex === "object" && ex !== null) {
    const msg = (ex as Record<string, unknown>).msg;

    if (typeof msg === "string" && msg.trim()) {
      return msg.trim();
    }
  }

  return typeof ex === "string" && ex.trim() ? ex.trim() : DEFAULT_ERROR;
}
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "");
}
