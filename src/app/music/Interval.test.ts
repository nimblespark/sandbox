import { expect, test } from "vitest"
import { interval, Interval } from "./Interval"

test("adds m2 + M2 to equal m3", () => {
  expect(Interval.name(Interval.add2(interval("m2"), interval("M2")))).toBe(
    "m3"
  )
})

test("adds m2 + M2 + p5 to equal m3", () => {
  expect(
    Interval.name(
      Interval.add([interval("m2"), interval("M2"), interval("p5")])
    )
  ).toBe("m7")
})

test("adds M2 + M2 to equal M3", () => {
  expect(Interval.name(Interval.add([interval("M2"), interval("M2")]))).toBe(
    "M3"
  )
})

test("adds M2 + M2 + m2 to equal M3", () => {
  expect(
    Interval.name(
      Interval.add([interval("M2"), interval("M2"), interval("m2")])
    )
  ).toBe("p4")
})

test("adds p4 + M2 to equal p5 using add2", () => {
  expect(Interval.name(Interval.add2(interval("p4"), interval("M2")))).toBe(
    "p5"
  )
})

test("adds p4 + p4 to equal m7 using add2", () => {
  const actual = Interval.add2(interval("p4"), interval("p4"))
  expect(Interval.name(actual)).toBe("m7")
})

test("adds m3 + m2 to equal dim4 using add2", () => {
  expect(Interval.name(Interval.add2(interval("m3"), interval("m2")))).toBe(
    "dim4"
  )
})

test("adds p4 + M2 to equal p5", () => {
  expect(Interval.name(Interval.add([interval("p4"), interval("M2")]))).toBe(
    "p5"
  )
})

test("adds M2 + M2 + m2 + M2 to equal p5", () => {
  expect(
    Interval.name(
      Interval.add([
        interval("M2"),
        interval("M2"),
        interval("m2"),
        interval("M2"),
      ])
    )
  ).toBe("p5")
})
