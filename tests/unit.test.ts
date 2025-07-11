import { EtaFileResolutionError } from "eta";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EtaHooked, { type EtaHookedConfig } from "../src/index.ts";

const FIXTURES_DIR = join(__dirname, "__fixtures__");

const mockTransform = (content: string, filename: string) => {
  if (filename.toLocaleLowerCase().endsWith(".md")) {
    return `<div>${content.trim()}</div>`;
  }
  return content;
};

describe("Unit Tests", () => {
  let etaHooked: EtaHooked;

  beforeEach(() => {
    etaHooked = new EtaHooked({ transform: mockTransform });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default config", () => {
      expect(etaHooked.transform).toBeDefined();
      expect(etaHooked.config).toBeDefined();
    });

    it("should initialize with custom transform", () => {
      const config: Partial<EtaHookedConfig> = {
        transform: mockTransform,
      };
      etaHooked = new EtaHooked(config);
      expect(etaHooked.transform).toBe(mockTransform);
    });

    it("should initialize with custom eta config", () => {
      const config: Partial<EtaHookedConfig> = {
        autoEscape: false,
      };
      etaHooked = new EtaHooked(config);
      expect(etaHooked.config.autoEscape).toBe(false);
    });
  });

  describe("readFile", () => {
    it("should read raw content without transform", () => {
      const result = etaHooked.readFile(join(FIXTURES_DIR, "simple.html"));
      expect(result).toContain("<h1>Title</h1>");
    });

    it("should handle template with transform", () => {
      const result = etaHooked.readFile(join(FIXTURES_DIR, "simple.md"));
      expect(result).toContain("<div># Hello</div>");
    });

    describe("error handling", () => {
      it("throws error for missing template", () => {
        expect(() => etaHooked.readFile("nonexistent.md"))
          .toThrow(EtaFileResolutionError);
        expect(() => etaHooked.readFile("nonexistent.md"))
          .toThrow("Could not find template: nonexistent.md");
      });
    });
  });
});
