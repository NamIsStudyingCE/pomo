import { describe, expect, it } from "vitest";
import { computeActualSeconds, computeRemainingSeconds } from "@/modules/focus/time-math";

describe("computeRemainingSeconds", () => {
  const started = 1_000_000;
  const planned = 25 * 60_000;

  it("đầy đủ khi vừa bắt đầu", () => {
    expect(computeRemainingSeconds(started, started, planned, 0)).toBe(1500);
  });

  it("giảm theo thời gian trôi", () => {
    expect(computeRemainingSeconds(started + 60_000, started, planned, 0)).toBe(1440);
  });

  it("trừ thời gian rời tab", () => {
    // trôi 60s, trong đó 30s rời tab -> còn 1470
    expect(computeRemainingSeconds(started + 60_000, started, planned, 30_000)).toBe(1470);
  });

  it("không bao giờ âm", () => {
    expect(computeRemainingSeconds(started + planned + 5000, started, planned, 0)).toBe(0);
  });
});

describe("computeActualSeconds", () => {
  const started = 1_000_000;

  it("đo thời gian thực tế đã trừ rời tab", () => {
    expect(computeActualSeconds(started + 600_000, started, 120_000)).toBe(480);
  });

  it("không bao giờ âm", () => {
    expect(computeActualSeconds(started + 1000, started, 5000)).toBe(0);
  });
});
