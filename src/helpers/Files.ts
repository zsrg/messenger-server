import Logger from "logger";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
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
   * Write file
   * @param {string} path
   * @param {string} base64
   * @returns {void}
   */
  public static writeFile(path: string, base64: string) {
    try {
      const options: { encoding: BufferEncoding } = { encoding: "base64" };
      writeFileSync(path, base64, options);
    } catch (e) {
      Logger.error(e.message);
    }
  };

  /**
   * Get file type
   * @param {string} base64
   * @returns {string}
   */
  public static getFileType(base64: string) {
    return base64.split("/")[1].split(";")[0];
  };

  /**
   * Get file data
   * @param {string} base64
   * @returns {string}
   */
  public static getFileData(base64: string) {
    return base64.split(",")[1];
  };

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

  /**
   * Delete folder if exists
   * @param {string} path
   * @returns {void}
   */
  public static deleteFolderIfExists(path: string) {
    if (existsSync(path)) {
      rmSync(path, { recursive: true });
    }
  }
}

export default Files;
