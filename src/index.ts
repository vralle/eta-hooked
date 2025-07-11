import { Eta, type EtaConfig, EtaFileResolutionError } from "eta";
import { readFileSync } from "node:fs";

/**
 * Content transformation hook.
 * Receives the raw content of a file and its absolute path, then returns the transformed string.
 * Common use cases include Markdown/MDX-to-HTML conversion, applying syntax highlighting, or injecting metadata.
 * Implementations may use file extension to determine transformation strategy.
 * @param str The raw content of the file
 * @param filename The full path to the file
 * @returns Transformed content as a string
 */
export type Transform = (str: string, filename: string) => string;

export interface EtaHookedConfig extends EtaConfig {
  transform: Transform;
}

class EtaHooked extends Eta {
  public transform: Transform;

  constructor(config?: Partial<EtaHookedConfig>) {
    const { transform = (str: string): string => str, ...etaConfig } = config || {};
    super(etaConfig);
    this.transform = transform;
  }

  override readFile = (path: string): string => {
    let res = "";
    try {
      res = readFileSync(path, "utf8");
    } catch (err) {
      // @ts-expect-error: Inherits the original code
      if (err?.code === "ENOENT") {
        throw new EtaFileResolutionError(`Could not find template: ${path}`);
      }

      throw err;
    }

    if (!this.transform) {
      return res;
    }

    return this.transform(res, path);
  };
}

export default EtaHooked;
