import Logger from "logger";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { extname } from "path";

class Files {
  /**
   * Read file
   * @param {string} path
   * @returns {any}
   */
  public static readFile(path: string) {
    try {
      const options: { encoding: BufferEncoding } = { encoding: null };

      const isJSON = extname(path) === ".json";

      if (isJSON) {
        options.encoding = "utf8";
      }

      const file = readFileSync(path, options);

      if (isJSON) {
        return JSON.parse(file);
      }

      return file;

    } catch (e) {
      Logger.error(e.message);
    }
  }

  /**
   * Create folder if not exists
   * @param {string} path
   * @returns {void}
   */
  public static createFolderIfNotExists(path: string) {
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  }
}

export default Files;
