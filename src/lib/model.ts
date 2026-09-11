import fs from "node:fs";
import path from "node:path";

/**
 * Server-side check for whether a real Panasonic clipper .glb has been
 * dropped into /public/models. See public/models/README.md for the spec.
 * Decided on the server so the client never attempts (and fails) a fetch
 * for a file that doesn't exist yet.
 */
export function hasClipperModel(): boolean {
  const file = path.join(process.cwd(), "public", "models", "panasonic-clipper.glb");
  try {
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
}
