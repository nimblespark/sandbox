import { Accidental } from "./MusicBasics"

export type Interval = { n: number; offset: Accidental }

export namespace Interval {
  export type Third = { n: 3; offset: number }
  export type Fifth = { n: 5; offset: number }
  export const unison = { n: 1, offset: 0 }
  export const octave = { n: 8, offset: 0 }
  export function halfSteps(interval: Interval): number {
    const o = interval.offset
    switch (interval.n) {
      case 1:
        return 0 + o
      case 2:
        return 2 + o
      case 3:
        return 4 + o
      case 4:
        return 5 + o
      case 5:
        return 7 + o
      case 6:
        return 9 + o
      case 7:
        return 11 + o
      default:
        return halfSteps({ n: interval.n - 7, offset: interval.offset }) + 12
    }
  }

  /**
   * only use with simple intervals!!!
   * @param interval
   */
  export function invert(interval: Interval): Interval {
    return {
      n: 9 - interval.n,
      offset: isPerfect(interval)
        ? interval.offset * -1
        : interval.offset * -1 - 1,
    }
  }

  export function toSimple(interval: Interval): Interval {
    return {
      n: interval.n % 7 === 0 ? 7 : interval.n % 7,
      offset: interval.offset,
    }
  }

  export function isPerfect(interval: Interval) {
    const simple = interval.n % 7
    return simple == 1 || simple == 4 || simple == 5
  }

  export function add2(interval1: Interval, interval2: Interval): Interval {
    const n = interval1.n + interval2.n - 1

    var offset
    // if result is perfect, add 1 to the offset
    if (isPerfect({ n: n, offset: 0 }))
      offset = interval1.offset + interval2.offset + 1
    else offset = interval1.offset + interval2.offset
    return {
      n: n,
      offset: offset,
    }
  }
  export function subtract(interval1: Interval, interval2: Interval): Interval {
    const n = interval1.n - interval2.n + 1

    var offset
    if (!isPerfect(interval2) && isPerfect(interval1))
      offset = interval1.offset - interval2.offset - 1
    else offset = interval1.offset - interval2.offset

    return {
      n: n,
      offset: offset,
    }
  }

  export function add(intervals: Interval[]): Interval {
    if (intervals.length == 0) return Interval.unison
    if (intervals.length == 1) return intervals[0]
    return intervals.reduce(add2)
  }
  export function name(interval: Interval): string {
    const isPerfect = Interval.isPerfect(interval)
    var prefix = ""
    switch (interval.offset) {
      case 0:
        if (isPerfect) prefix = "p"
        else prefix = "M"
        break
      case -1:
        if (isPerfect) prefix = "dim"
        else prefix = "m"
        break
      case 1:
        prefix = "aug"
        break
      case -2:
        if (isPerfect) prefix = "-2_"
        else prefix = "dim"
        break
      default:
        prefix = `${interval.offset}_`
    }

    return `${prefix}${interval.n}`
  }
}

// console.log(
//   "ADDING INTERVALS",
//   Interval.name(
//     Interval.add([
//       { n: 6, offset: 0 },
//       { n: -3, offset: 0 },
//     ])
//   )
// )

// console.log(
//   "SUBTACTING INTERVALS",
//   Interval.name(Interval.subtract({ n: 5, offset: 0 }, { n: 3, offset: -1 }))
// )

export function interval(str: string): Interval {
  const match = str.match(/\d+/)
  if (!match) throw new Error("Invalid interval format")

  const n = parseInt(match[0])

  var isPerfect = false
  const simple = n % 7
  if (simple == 1 || simple == 4 || simple == 5) isPerfect = true

  const quality = str.replace(/[0-9]/g, "")
  var offset
  switch (isPerfect) {
    case true:
      switch (quality) {
        case "p":
          offset = 0
          break
        case "aug":
          offset = 1
          break
        case "dim":
          offset = -1
          break
        default:
          throw new Error("Prefix is invalid")
      }
      break
    case false:
      switch (quality) {
        case "M":
          offset = 0
          break
        case "m":
          offset = -1
          break
        case "dim":
          offset = -2
          break
        case "aug":
          offset = 1
          break
        default:
          throw new Error(`Prefix is invalid: ${quality} for ${str}`)
      }
  }
  return { n: n, offset: offset }
}
