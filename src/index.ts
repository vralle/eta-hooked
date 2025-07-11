import { Eta, type EtaConfig, EtaFileResolutionError } from "eta";
import { readFileSync } from "node:fs";

export type Transformer = (str: string, filename: string) => string;

export interface EtaHookedConfig extends EtaConfig {
  transformer?: Transformer;
}

class EtaHooked extends Eta {
  public transformer?: Transformer | undefined;

  constructor(config?: Partial<EtaHookedConfig>) {
    const { transformer = (str: string): string => str, ...etaConfig } = config || {};
    super(etaConfig);
    this.transformer = transformer;
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

    if (!this.transformer) {
      return res;
    }

    return this.transformer(res, path);
  };
}

export default EtaHooked;
