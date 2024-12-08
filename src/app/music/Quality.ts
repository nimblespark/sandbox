import { Seventh, Triad } from "./ChordStructure"
import { interval, Interval } from "./Interval"

export enum Quality {
  Maj7 = "Maj7",
  Dom7 = "Dom7",
  Min7 = "Min7",
  Half = "Half-Dim7",
  Full = "Dim7",
  Maj = "Maj",
  Min = "Min",
  Dim = "Dim",
  Aug = "Aug",
}
export namespace Quality {
  export function toLeadSheet(quality: Quality): string {
    switch (quality) {
      case Quality.Maj7:
        return "△7"
      case Quality.Dom7:
        return "7"
      case Quality.Min7:
        return "m7"
      case Quality.Half:
        return "ø7"
      case Quality.Full:
        return "°7"
      case Quality.Maj:
        return ""
      case Quality.Min:
        return "m"
      case Quality.Dim:
        return "°"
      case Quality.Aug:
        return "+"
    }
  }
  export function isMajor(quality: Quality): boolean {
    return Interval.name(Quality.toIntervals(quality)[0]) === "M3"
  }
  export function isMinor(quality: Quality): boolean {
    return Interval.name(Quality.toIntervals(quality)[0]) === "m3"
  }
  export function isSeventh(quality: Quality): boolean {
    return Quality.toIntervals(quality).length === 3
  }
  export function isTriad(quality: Quality) {
    return Quality.toIntervals(quality).length === 2
  }

  export function toIntervals(quality: Quality): Interval[] {
    switch (quality) {
      case Quality.Maj7:
        return [interval("M3"), interval("m3"), interval("M3")] as Seventh
      case Quality.Dom7:
        return [interval("M3"), interval("m3"), interval("m3")] as Seventh
      case Quality.Min7:
        return [interval("m3"), interval("M3"), interval("m3")] as Seventh
      case Quality.Half:
        return [interval("m3"), interval("m3"), interval("M3")] as Seventh
      case Quality.Full:
        return [interval("m3"), interval("m3"), interval("m3")] as Seventh
      case Quality.Maj:
        return [interval("M3"), interval("m3")] as Triad
      case Quality.Min:
        return [interval("m3"), interval("M3")] as Triad
      case Quality.Dim:
        return [interval("m3"), interval("m3")] as Triad
      case Quality.Aug:
        return [interval("M3"), interval("M3")] as Triad
    }
  }
}
