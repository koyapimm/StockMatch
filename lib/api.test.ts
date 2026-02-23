import { describe, it, expect, afterEach } from "vitest";
import {
  getApiImageUrl,
  getStatusText,
  getVerificationStatusText,
} from "./api";

describe("lib/api", () => {
  describe("getApiImageUrl", () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL;

    afterEach(() => {
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });

    it("undefined/null için placeholder döndürmeli", () => {
      expect(getApiImageUrl()).toBe("/placeholder-product.jpg");
      expect(getApiImageUrl("")).toBe("/placeholder-product.jpg");
    });

    it("http ile başlayan URL'i olduğu gibi döndürmeli", () => {
      const url = "https://example.com/image.jpg";
      expect(getApiImageUrl(url)).toBe(url);
    });

    it("relative path için base URL ile birleştirmeli", () => {
      const path = "/uploads/products/1.jpg";
      const result = getApiImageUrl(path);
      expect(result).toContain("/uploads/products/1.jpg");
      expect(result).not.toBe(path);
    });
  });

  describe("getStatusText", () => {
    it("ürün status 1 için Bekliyor", () => {
      expect(getStatusText(1)).toBe("Bekliyor");
    });

    it("ürün status 2 için Aktif", () => {
      expect(getStatusText(2)).toBe("Aktif");
    });

    it("ürün status 3 için Satıldı", () => {
      expect(getStatusText(3)).toBe("Satıldı");
    });

    it("ürün status 4 için Süresi Doldu", () => {
      expect(getStatusText(4)).toBe("Süresi Doldu");
    });

    it("bilinmeyen status için Bilinmiyor", () => {
      expect(getStatusText(99)).toBe("Bilinmiyor");
    });
  });

  describe("getVerificationStatusText", () => {
    it("1 için Bekliyor", () => expect(getVerificationStatusText(1)).toBe("Bekliyor"));
    it("2 için İnceleniyor", () => expect(getVerificationStatusText(2)).toBe("İnceleniyor"));
    it("3 için Onaylandı", () => expect(getVerificationStatusText(3)).toBe("Onaylandı"));
    it("4 için Reddedildi", () => expect(getVerificationStatusText(4)).toBe("Reddedildi"));
    it("bilinmeyen için Bilinmiyor", () => expect(getVerificationStatusText(0)).toBe("Bilinmiyor"));
  });
});
