export function isDev(): boolean {
  return (
    (import.meta as any)?.env?.MODE === "development" ||
    (typeof (globalThis as any).process !== "undefined" &&
      (globalThis as any).process.env.NODE_ENV === "development") ||
    (typeof window !== "undefined" &&
      (window as any).env?.MODE === "development")
  );
}
