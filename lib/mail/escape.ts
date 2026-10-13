const MAP: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapes user-supplied text before it goes inside an HTML mail. */
export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => MAP[c]);
