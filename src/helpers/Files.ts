import { extname } from "path";
import { readFileSync } from "fs";

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
      console.log(e.message);
    }
  }
}

export default Files;
