import { Interval } from "./Interval"
import { Inversion } from "./Inversion"
import { Quality } from "./Quality"

export type Triad = [Interval.Third, Interval.Third]
export type Shell = [Interval.Third, Interval.Fifth]
export type Seventh = [Interval.Third, Interval.Third, Interval.Third]

export type ChordStructure = Triad | Seventh | Shell | Interval[]
export const ChordStructure = {
  isTriad(chord: ChordStructure): chord is Triad {
    return chord.length === 2
  },
  isSeventh(chord: ChordStructure): chord is Seventh {
    return chord.length === 3
  },
  isShell(chord: ChordStructure): chord is Shell {
    return chord.length === 2 && chord[0].n === 3 && chord[1].n === 5
  },

  toQuality(chord: ChordStructure): Quality | null {
    // If chord it's seventh chord
    if (this.isSeventh(chord)) {
      switch (Interval.name(chord[0])) {
        case "m3":
          switch (Interval.name(chord[1])) {
            case "m3":
              switch (Interval.name(chord[2])) {
                case "m3":
                  return Quality.Full
                case "M3":
                  return Quality.Half
                default:
                  return null
              }
            case "M3":
              switch (Interval.name(chord[2])) {
                case "m3":
                  return Quality.Min7
                default:
                  return null
              }
            default:
              return null
          }
        case "M3":
          switch (Interval.name(chord[1])) {
            case "m3":
              switch (Interval.name(chord[2])) {
                case "m3":
                  return Quality.Dom7
                case "M3":
                  return Quality.Maj7
                default:
                  return null
              }
            default:
              return null
          }
        default:
          return null
      }
    } else if (this.isTriad(chord)) {
      // If it's a triad
      switch (Interval.name(chord[0])) {
        case "m3":
          switch (Interval.name(chord[1])) {
            case "m3":
              return Quality.Dim
            case "M3":
              return Quality.Min
            default:
              return null
          }
        case "M3":
          switch (Interval.name(chord[1])) {
            case "m3":
              return Quality.Maj
            case "M3":
              return Quality.Aug
            default:
              return null
          }
        default:
          return null
      }
    } else return null
  },
  nextInversion(chord: ChordStructure): ChordStructure {
    const remainingIntervals = chord.slice(1, chord.length)

    const newInterval = Interval.subtract(
      Interval.invert(chord[0]),
      Interval.add(chord.slice(1, chord.length))
    )
    //console.log("interval to add on top", newInterval)

    //console.log({ remainingIntervals })
    return [...remainingIntervals, newInterval]
  },

  applyInversion(inversion: Inversion, chord: ChordStructure): Interval[] {
    var chordToReturn = chord

    for (let i = 0; i < inversion; i++) {
      chordToReturn = this.nextInversion(chordToReturn)
    }
    return chordToReturn
  },
}
