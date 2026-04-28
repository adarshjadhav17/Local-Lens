import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  inferInterestSignals,
  normalizeInterestText,
  rankItemsByInterests
} from "../lib/interests.ts";

describe("interest inference", () => {
  it("maps shorthand and misspellings to granular interests", () => {
    assertInterests(item("Need pre before gym", "Protien and creatin sale near you"), [
      "supplements",
      "strength_training"
    ]);
    assertInterests(item("Prepared meals deal", "Healthy meals delivered this week"), [
      "meal_kits"
    ]);
    assertInterests(item("Gym clothes drop", "New gymwear and trainers in stock"), [
      "activewear",
      "sneakers"
    ]);
    assertInterests(item("RNB night", "Live R&B and soul show downtown"), ["r_and_b"]);
    assertInterests(item("Museum exibit", "New gallery exhibtion for families"), [
      "museums",
      "family_events"
    ]);
  });

  it("normalizes aliases into canonical text", () => {
    assert.match(normalizeInterestText("pre-workout and protien"), /pre workout/);
    assert.match(normalizeInterestText("mealprep and gym clothes"), /meal kit/);
    assert.match(normalizeInterestText("mealprep and gym clothes"), /activewear/);
  });

  it("ranks matching items above unrelated items", () => {
    const rankedItems = rankItemsByInterests(
      [
        item("Generic theater show", "Downtown play"),
        item("Protein and pre sale", "Preworkout and supplements")
      ],
      {
        domains: { fitness: 1 },
        interests: { supplements: 5 }
      }
    );

    assert.equal(rankedItems[0].title, "Protein and pre sale");
  });
});

function assertInterests(testItem, expectedInterests) {
  const interests = new Set(inferInterestSignals(testItem).map((signal) => signal.interest));
  const missing = expectedInterests.filter((interest) => !interests.has(interest));

  assert.deepEqual(missing, []);
}

function item(title, description) {
  return {
    title,
    meta: "",
    description,
    tag: "Test"
  };
}
