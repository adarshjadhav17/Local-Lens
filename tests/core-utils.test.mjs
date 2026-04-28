import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDistanceMiles } from "../lib/geo.ts";
import { getWeatherCondition } from "../lib/weather-codes.ts";

describe("weather code labels", () => {
  it("maps known weather codes and falls back for unknown values", () => {
    assert.equal(getWeatherCondition(0), "Clear");
    assert.equal(getWeatherCondition(63), "Rain");
    assert.equal(getWeatherCondition(999), "Current conditions");
  });
});

describe("geo utilities", () => {
  it("calculates distance between nearby coordinates", () => {
    const distance = getDistanceMiles(
      { latitude: 41.8781, longitude: -87.6298 },
      { latitude: 41.9742, longitude: -87.9073 }
    );

    assert.ok(distance > 14);
    assert.ok(distance < 17);
  });
});
