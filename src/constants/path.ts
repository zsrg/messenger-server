import { join } from "path";

const { cwd } = process;

export const CONFIG_PATH = join(cwd(), "config.json");
export const LOGS_FOLDER = join(cwd(), "logs");
