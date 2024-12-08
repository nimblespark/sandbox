import { rotateBy } from "../helpers"
import { interval, Interval } from "./Interval"

export enum Mode {
  Ionian,
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  Aeloian,
  Locrian,
}

export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type Scale = Interval[]
export namespace Scale {
  export const MajorScale: Scale = [
    interval("M2"),
    interval("M2"),
    interval("m2"),
    interval("M2"),
    interval("M2"),
    interval("M2"),
    interval("m2"),
  ]

  export const HarmonicMinor: Scale = [
    interval("M2"),
    interval("m2"),
    interval("M2"),
    interval("M2"),
    interval("m2"),
    interval("aug2"),
    interval("m2"),
  ]

  export const MinorScale = mode(Mode.Aeloian)

  export function mode(mode: Mode): Scale {
    return rotateBy(mode, MajorScale)
  }

  export function toDisplayString(scale: Scale) {
    var output = ""
    scale.forEach((interval) => (output += Interval.name(interval) + " "))
    return output
  }
}
