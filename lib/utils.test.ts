import { describe, it, expect } from "vitest";
import {
  getCompanyStatusBadge,
  getProductStatusBadge,
  getRequestStatusBadge,
  formatCurrency,
  formatDate,
  cleanPhoneNumber,
  isAdminUser,
} from "./utils";

describe("lib/utils", () => {
  describe("getCompanyStatusBadge", () => {
    it("1 için Bekliyor döndürmeli", () => {
      const result = getCompanyStatusBadge(1);
      expect(result.label).toBe("Bekliyor");
      expect(result.color).toContain("yellow");
    });

    it("2 için İnceleniyor döndürmeli", () => {
      const result = getCompanyStatusBadge(2);
      expect(result.label).toBe("İnceleniyor");
      expect(result.color).toContain("blue");
    });

    it("3 için Onaylı döndürmeli", () => {
      const result = getCompanyStatusBadge(3);
      expect(result.label).toBe("Onaylı");
      expect(result.color).toContain("green");
    });

    it("4 için Reddedildi döndürmeli", () => {
      const result = getCompanyStatusBadge(4);
      expect(result.label).toBe("Reddedildi");
      expect(result.color).toContain("red");
    });

    it("bilinmeyen status için Bilinmiyor döndürmeli", () => {
      const result = getCompanyStatusBadge(99);
      expect(result.label).toBe("Bilinmiyor");
    });
  });

  describe("getProductStatusBadge", () => {
    it("1 için Taslak döndürmeli", () => {
      const result = getProductStatusBadge(1);
      expect(result.label).toBe("Taslak");
    });

    it("2 için Aktif döndürmeli", () => {
      const result = getProductStatusBadge(2);
      expect(result.label).toBe("Aktif");
      expect(result.color).toContain("green");
    });

    it("3 için Satıldı döndürmeli", () => {
      const result = getProductStatusBadge(3);
      expect(result.label).toBe("Satıldı");
    });

    it("4 için Pasif döndürmeli", () => {
      const result = getProductStatusBadge(4);
      expect(result.label).toBe("Pasif");
    });
  });

  describe("getRequestStatusBadge", () => {
    it("1 için Bekliyor döndürmeli", () => {
      const result = getRequestStatusBadge(1);
      expect(result.label).toBe("Bekliyor");
    });

    it("2 için Onaylandı döndürmeli", () => {
      const result = getRequestStatusBadge(2);
      expect(result.label).toBe("Onaylandı");
    });

    it("3 için Reddedildi döndürmeli", () => {
      const result = getRequestStatusBadge(3);
      expect(result.label).toBe("Reddedildi");
    });

    it("4 için Süresi Doldu döndürmeli", () => {
      const result = getRequestStatusBadge(4);
      expect(result.label).toBe("Süresi Doldu");
    });
  });

  describe("formatCurrency", () => {
    it("TRY için ₺ ile formatlamalı", () => {
      expect(formatCurrency(15000, "TRY")).toBe("₺15.000");
    });

    it("USD için $ ile formatlamalı", () => {
      expect(formatCurrency(1000, "USD")).toBe("$1.000");
    });

    it("EUR için € ile formatlamalı", () => {
      expect(formatCurrency(500, "EUR")).toBe("€500");
    });

    it("Türkçe locale ile binlik ayırıcı kullanmalı", () => {
      expect(formatCurrency(1234567, "TRY")).toContain("1.234.567");
    });
  });

  describe("formatDate", () => {
    it("geçerli tarih string için Türkçe format döndürmeli", () => {
      const result = formatDate("2024-01-15T00:00:00Z");
      expect(result).toMatch(/\d+/); // Sayı içermeli
      expect(result).toMatch(/Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık/);
    });
  });

  describe("cleanPhoneNumber", () => {
    it("sadece rakamları döndürmeli", () => {
      expect(cleanPhoneNumber("0532 123 45 67")).toBe("05321234567");
    });

    it("tireleri kaldırmalı", () => {
      expect(cleanPhoneNumber("0212-123-45-67")).toBe("02121234567");
    });

    it("parantezleri kaldırmalı", () => {
      expect(cleanPhoneNumber("(532) 123 4567")).toBe("5321234567");
    });

    it("boş string için boş döndürmeli", () => {
      expect(cleanPhoneNumber("")).toBe("");
    });
  });

  describe("isAdminUser", () => {
    it("admin@stockmatch.com için true döndürmeli", () => {
      expect(isAdminUser("admin@stockmatch.com")).toBe(true);
    });

    it("ahmet@test.com için true döndürmeli", () => {
      expect(isAdminUser("ahmet@test.com")).toBe(true);
    });

    it("diğer emailler için false döndürmeli", () => {
      expect(isAdminUser("user@company.com")).toBe(false);
    });

    it("undefined için false döndürmeli", () => {
      expect(isAdminUser()).toBe(false);
    });
  });
});
