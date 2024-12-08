import { expect, test } from "vitest"
import { Interval } from "./Interval"
import { OctavedNote } from "./OctavedNote"
import { oNote } from "./MusicBasics"

test("p8", () => {
  expect(
    Interval.name(OctavedNote.interval(oNote("C", 4), oNote("C", 5)))
  ).toBe("p8")
})
test("p5", () => {
  expect(
    Interval.name(OctavedNote.interval(oNote("F", 4), oNote("C", 5)))
  ).toBe("p5")
})
test("p5", () => {
  expect(
    Interval.name(OctavedNote.interval(oNote("G", 4), oNote("D", 5)))
  ).toBe("p5")
})

test("p15", () => {
  expect(
    Interval.name(OctavedNote.interval(oNote("G", 2), oNote("G", 4)))
  ).toBe("p15")
})
