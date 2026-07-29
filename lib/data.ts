import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Dataset } from "./types";

let cached: Dataset | null = null;

export async function getDataset(): Promise<Dataset> {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "public", "data", "protests.json");
  const raw = await fs.readFile(filePath, "utf-8");
  cached = JSON.parse(raw) as Dataset;
  return cached;
}
