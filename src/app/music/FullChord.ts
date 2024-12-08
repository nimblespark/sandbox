import { ChordStructure } from "./ChordStructure"

import { Interval } from "./Interval"
import { Inversion } from "./Inversion"
import { NamedChord } from "./Music"
import { Note } from "./Note"
import { Quality } from "./Quality"
import { Voice } from "./Voice"

export type FullChord = {
  chord: NamedChord
  inversion: Inversion
}
export namespace FullChord {
  export function toLeadSheet(fullChord: FullChord) {
    return `${NamedChord.toLeadSheet(fullChord.chord)}
      ${
        fullChord.inversion > 0
          ? `/
      ${Note.toDisplayString(FullChord.bassNote(fullChord))}`
          : ""
      }`
  }

  export function voice(voice: Voice, { chord, inversion }: FullChord): Note {
    const root = chord.root

    if (Quality.isTriad(chord.quality) && voice === 3) return root

    const intervals = Quality.toIntervals(chord.quality)

    const invertedChord = ChordStructure.applyInversion(inversion, intervals)

    var sum: Interval[] = []
    for (let i = 0; i < inversion; i++) {
      sum.push(intervals[i])
      console.log("Is this undefined", intervals[i])
    }

    const bassNote = Note.transpose(Interval.add(sum), root)

    var intervalsToAdd = []
    for (let i = 0; i < voice; i++) {
      intervalsToAdd.push(invertedChord[i])
    }

    return Note.transpose(Interval.add(intervalsToAdd), bassNote)
  }

  export function bassNote(fullChord: FullChord): Note {
    return voice(Voice.Bass, fullChord)
  }
}
