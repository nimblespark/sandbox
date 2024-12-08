import { expect, test } from "vitest"
import { compareAll, Harmony, lookForInterval, Rule, Rules } from "./Harmony"
import { note, oNote } from "./MusicBasics"
import { interval, Interval } from "./Interval"
import { OctavedNote } from "./OctavedNote"

// test("testing harmony", () => {
//   const harmony: Harmony = [note("C"), note("B"), note("G"), note("E")]
//   const withinRanges = Harmony.possibilitiesWithinRanges(harmony)

//   console.log("within ranges", withinRanges)
//   expect(
//     console.log(
//       "harmony",
//       Harmony.possibilitiesToOctavedHarmonyOptions(withinRanges)
//     )
//   ).toBe("idk")
// })

test("testing compareAll", () => {
  const octavedHarmony = [
    oNote("C", 4),
    oNote("E", 4),
    oNote("G", 4),
    oNote("B", 4),
  ]
  expect(
    compareAll(
      (a1, a2) =>
        Interval.compare(OctavedNote.interval(a1, a2), interval("p5")),
      octavedHarmony
    ).length
  ).toBe(2)
})

test("identify perfect 8", () => {
  const o1 = [oNote("C", 4), oNote("E", 4), oNote("G", 4), oNote("C", 5)]
  expect(lookForInterval(interval("p8"), o1).length).toBe(1)
})

test("identify perfect 5", () => {
  const o1 = [oNote("C", 4), oNote("E", 4), oNote("G", 4), oNote("C", 5)]
  expect(lookForInterval(interval("p5"), o1).length).toBe(1)
})

test("parallel 5th", () => {
  const o1 = [oNote("C", 4), oNote("E", 4), oNote("G", 4), oNote("B", 4)]
  const o2 = [oNote("D", 4), oNote("F", 4), oNote("A", 4), oNote("C", 4)]
  expect(Rule.containsParallelFifths(o1, o2)).toBe(true)
})
test("parallesl 8th", () => {
  const o1 = [oNote("C", 4), oNote("E", 4), oNote("G", 4), oNote("C", 5)]
  const o2 = [oNote("D", 4), oNote("F", 4), oNote("A", 4), oNote("D", 4)]
  expect(Rule.containsParallelFifths(o1, o2)).toBe(true)
})
test("parallel 5th", () => {
  const o1 = [oNote("F", 2), oNote("A", 3), oNote("F", 4), oNote("C", 5)]
  const o2 = [oNote("G", 2), oNote("B", 3), oNote("G", 4), oNote("D", 5)]
  expect(Rule.containsParallelFifths(o1, o2)).toBe(true)
})
test("parallel 8th", () => {
  const o1 = [oNote("F", 2), oNote("A", 3), oNote("F", 4), oNote("C", 5)]
  const o2 = [oNote("G", 2), oNote("B", 3), oNote("G", 4), oNote("D", 5)]
  expect(Rule.containsParallelFifteenths(o1, o2)).toBe(true)
})
