import test from "node:test";
import assert from "node:assert/strict";
import {
  journeyMilestones,
  journeyYears,
  journeyMonth,
} from "../../src/lib/journey";
import { allEntries } from "../../src/lib/content";

test("all eleven milestones retain the supplied chronology and overlapping intervals", () => {
  const groups = journeyYears();
  assert.deepEqual(
    groups.map((g) => [g.year, g.milestones.length]),
    [
      ["2024", 1],
      ["2025", 5],
      ["2026", 5],
    ],
  );
  const items = groups.flatMap((g) => g.milestones);
  assert.deepEqual(
    items.map((e) => [e.id, e.start, e.end || null]),
    [
      ["tiet-degree", "2024-08", null],
      ["h-star", "2025-01", null],
      ["iit-jodhpur", "2025-05", null],
      ["iit-ropar", "2025-08", null],
      ["food-digital-twin", "2025-09", null],
      ["technical-coordinator", "2025-11", "2026-02"],
      ["fold", "2026-01", "2026-06"],
      ["urja", "2026-02", null],
      ["mobile-ml", "2026-03", "present"],
      ["eeg", "2026-08", "2026-10"],
      ["tiet-coe", "2026-08", "present"],
    ],
  );
  assert.equal(journeyMonth("2026-08"), "August 2026");
  const reverse = journeyYears([...journeyMilestones].reverse()).flatMap(
    (g) => g.milestones,
  );
  assert.deepEqual(
    reverse.filter((e) => e.start === "2026-08").map((e) => e.id),
    ["tiet-coe", "eeg"],
  );
  assert.deepEqual(
    items.map((e) => e.start),
    [...items.map((e) => e.start)].sort(),
  );
});

test("timeline links resolve and pending research does not become a claimed result", () => {
  const entries = allEntries();
  for (const milestone of journeyMilestones) {
    if (milestone.link) {
      const entry = entries.find(
        (entry) => `/${entry.kind}/${entry.slug}` === milestone.link!.href,
      );
      assert.ok(entry, milestone.id);
      if (entry.status === "Verification pending")
        assert.match(milestone.link.label, /verification pending/);
    }
  }
  const ropar = journeyMilestones.find((e) => e.id === "iit-ropar")!;
  assert.match(ropar.title, /ISRO-backed.*IIT Ropar collaboration/);
  assert.match(ropar.description, /not direct employment with ISRO/);
  assert.match(
    journeyMilestones.find((e) => e.id === "iit-jodhpur")!.title,
    /Research internship/,
  );
  const mobile = journeyMilestones.find((e) => e.id === "mobile-ml")!;
  assert.match(mobile.description, /associated with Prof\. Xingbin Wang/);
  assert.doesNotMatch(mobile.description, /Tianjin|Professor at|supervised by/);
  const copy = journeyMilestones
    .map((e) => `${e.title} ${e.description}`)
    .join(" ");
  assert.doesNotMatch(
    copy,
    /accepted paper|patent pending|99\.|FPS|37%|5,000|AAAI/,
  );
});

test("invalid dates and duplicate identity fail validation without changing source order", () => {
  const fixture = journeyMilestones[0];
  for (const interval of [
    { start: "2025-13" },
    { start: "2025-01", end: "2024-12" },
    { start: "2025-01", end: "2026-99" },
  ])
    assert.throws(() => journeyYears([{ ...fixture, ...interval }]));
  assert.throws(() => journeyYears([fixture, fixture]));
  const before = journeyMilestones.map((e) => e.id);
  journeyYears();
  assert.deepEqual(
    journeyMilestones.map((e) => e.id),
    before,
  );
});
