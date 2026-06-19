export const logger = {
  info(event: string, data: Record<string, unknown> = {}) { console.info(JSON.stringify({ level: "info", event, ...data, at: new Date().toISOString() })); },
  error(event: string, error: unknown, data: Record<string, unknown> = {}) { console.error(JSON.stringify({ level: "error", event, message: error instanceof Error ? error.message : String(error), ...data, at: new Date().toISOString() })); },
};
