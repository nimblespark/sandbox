import { oNote } from "./MusicBasics"
import { OctavedNote } from "./OctavedNote"

export enum Voice {
  Bass,
  Tenor,
  Alto,
  Soprano,
}

export namespace Voice {
  export function range(voice: Voice): Range {
    switch (voice) {
      case Voice.Bass:
        return { low: oNote("E", 2), high: oNote("C", 4) }
      case Voice.Tenor:
        return { low: oNote("B", 2), high: oNote("G", 4) }
      case Voice.Alto:
        return { low: oNote("F", 3), high: oNote("D", 5) }
      case Voice.Soprano:
        return { low: oNote("C", 4), high: oNote("A", 5) }
      default:
        throw new Error(`Somehow voice wasn't 0 to 3, range was ${voice}`)
    }
  }
}

export type Range = { low: OctavedNote; high: OctavedNote }

export const Range = {
  includes(note: OctavedNote, range: Range) {
    const low = OctavedNote.toMidiNumber(range.low)
    const high = OctavedNote.toMidiNumber(range.high)
    const n = OctavedNote.toMidiNumber(note)

    return n >= low && n <= high
  },
}
