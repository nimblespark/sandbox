import { Interval } from "./Interval"
import { FullChord, Inversion, Mode, Quality } from "./Music"
import { Note, note } from "./MusicBasics"

const fretsCount = 24
const lowestFret = 0

export type String = 1 | 2 | 3 | 4 | 5 | 6
export namespace String {
  export function firstNote(string: String) {
    switch (string) {
      case 1:
        return note("E")
      case 2:
        return note("B")
      case 3:
        return note("G")
      case 4:
        return note("D")
      case 5:
        return note("A")
      case 6:
        return note("E")
    }
  }
}

type GuitarNote = {
  string: String
  fret: number
}
const GuitarNote = {
  toTex(note: GuitarNote): string {
    return `${note.fret}.${note.string}`
  },
  /** Takes a guitar string and a Note and calculates a list of frets that note is on */
  onString(string: String, note: Note): GuitarNote[] {
    let currentNote: number = Note.toNoteNumber(note)
    let fret = currentNote - Note.toNoteNumber(String.firstNote(string))
    //  console.log(fret)
    const listOfFrets = []
    while (fret <= fretsCount) {
      if (fret >= lowestFret) listOfFrets.push(fret)
      currentNote += Interval.halfSteps(Interval.octave)
      fret = currentNote - Note.toNoteNumber(String.firstNote(string))
    }
    return listOfFrets.map((f) => ({ string: string, fret: f }))
  },
}

//console.log(GuitarNote.onString(2, note("B")).map((note) => note.fret))

function g(string: String, fret: number): GuitarNote {
  return { string, fret }
}

/** Generates a chord pattern based on string, inversion, and quality */
type ChordPattern = GuitarNote[]
const ChordPattern = {
  generate(
    string: String,
    quality: Quality,
    inversion: Inversion = Inversion.Root
  ): ChordPattern {
    switch (string) {
      case 6:
        switch (quality) {
          case Quality.Maj7:
            switch (inversion) {
              case Inversion.Root:
                return [g(6, 0), g(4, 1), g(3, 1), g(2, 0)]
              case Inversion.First:
                return [g(6, 0), g(4, -2), g(3, 0), g(2, 0)]
              case Inversion.Second:
                return [g(6, 0), g(5, 0), g(4, -1), g(3, 1)]
              case Inversion.Third:
                return [g(6, 0), g(5, 0), g(4, -2), g(3, -2)]
            }
          case Quality.Dom7:
            switch (inversion) {
              case Inversion.Root:
                return [g(6, 0), g(4, 0), g(3, 1), g(2, 0)]
              case Inversion.First:
                return [g(6, 0), g(4, -2), g(3, 0), g(2, -1)]
              case Inversion.Second:
                return [g(6, 0), g(4, -1), g(3, 0), g(2, -2)]
              case Inversion.Third:
                return [g(6, 0), g(4, -1), g(3, -1), g(2, -1)]
            }
          case Quality.Min7:
            switch (inversion) {
              case Inversion.Root:
                return [g(6, 0), g(4, 0), g(3, 0), g(2, 0)]
              case Inversion.First:
                return [g(6, 0), g(4, -1), g(3, 1), g(2, 0)]
              case Inversion.Second:
                return [g(6, 0), g(4, -2), g(3, 0), g(2, -2)]
              case Inversion.Third:
                return [g(6, 0), g(4, -1), g(3, -1), g(2, -2)]
            }

          case Quality.Half:
            switch (inversion) {
              case Inversion.Root:
                return [g(6, 0), g(4, 0), g(3, 0), g(2, -1)]
              case Inversion.First:
                return [g(6, 0), g(4, -1), g(3, 0), g(2, 0)]
              case Inversion.Second:
                return [g(6, 0), g(4, -1), g(3, 1), g(2, -1)]
              case Inversion.Third:
                return [g(6, 0), g(4, -2), g(3, -1), g(2, -2)]
            }
          case Quality.Full:
            switch (inversion) {
              case Inversion.Root:
                return [g(6, 0), g(4, -1), g(3, 0), g(2, -1)]
              case Inversion.First:
                return [g(6, 0), g(4, -1), g(3, 0), g(2, -1)]
              case Inversion.Second:
                return [g(6, 0), g(4, -1), g(3, 0), g(2, -1)]
              case Inversion.Third:
                return [g(6, 0), g(4, -1), g(3, 0), g(2, -1)]
            }
        }

      case 5:
        switch (quality) {
          case Quality.Maj7:
            switch (inversion) {
              case Inversion.Root:
                return [g(5, 0), g(4, 2), g(3, 1), g(2, 2)]
              case Inversion.First:
                return [g(5, 0), g(4, 2), g(3, -2), g(2, 1)]
              case Inversion.Second:
                return [g(5, 0), g(4, 0), g(3, -1), g(2, 2)]
              case Inversion.Third:
                return [g(5, 0), g(4, 0), g(3, -2), g(2, -1)]
            }
          case Quality.Dom7:
            switch (inversion) {
              case Inversion.Root:
                return [g(5, 0), g(4, 2), g(3, 0), g(2, 2)]
              case Inversion.First:
                return [g(5, 0), g(4, 1), g(3, -2), g(2, 1)]
              case Inversion.Second:
                return [g(5, 0), g(4, 0), g(3, -1), g(2, 1)]
              case Inversion.Third:
                return [g(5, 0), g(4, 1), g(3, -1), g(2, 0)]
            }
          case Quality.Min7:
            switch (inversion) {
              case Inversion.Root:
                return [g(5, 0), g(4, 2), g(3, 0), g(2, 1)]
              case Inversion.First:
                return [g(5, 0), g(4, 2), g(3, -1), g(2, 2)]
              case Inversion.Second:
                return [g(5, 0), g(4, 0), g(3, -2), g(2, 1)]
              case Inversion.Third:
                return [g(5, 0), g(4, 0), g(3, -1), g(2, 0)]
            }

          case Quality.Half:
            switch (inversion) {
              case Inversion.Root:
                return [g(5, 0), g(4, 1), g(3, 0), g(2, 1)]
              case Inversion.First:
                return [g(5, 0), g(4, 2), g(3, -1), g(2, 1)]
              case Inversion.Second:
                return [g(5, 0), g(4, 1), g(3, -1), g(2, 2)]
              case Inversion.Third:
                return [g(5, 0), g(4, 0), g(3, -2), g(2, 0)]
            }
          case Quality.Full:
            switch (inversion) {
              case Inversion.Root:
              case Inversion.First:
              case Inversion.Second:
              case Inversion.Third:
                return [g(5, 0), g(4, 1), g(3, -1), g(2, 1)]
            }
        }

      default:
        return []
    }
  },
}

export type GuitarChord = { name?: string; notes: GuitarNote[] }
export const GuitarChord = {
  toTex(chord: GuitarChord) {
    return `(${chord.notes
      .map((note) => GuitarNote.toTex(note) + " ")
      .join("")}).1${chord.name && `{ch "${chord.name}"}`}|`
  },
  /** Generates all the guitar chords that fit the parameters */
  generate(
    root: Note,
    quality: Quality,
    string?: String,
    inversion?: Inversion
  ): GuitarChord[] {
    var chords: GuitarChord[] = []
    const inversions = inversion
      ? [inversion]
      : [Inversion.Root, Inversion.First, Inversion.Second, Inversion.Third]

    for (const inversion of inversions) {
      const bassNote = FullChord.bassNote({
        inversion: inversion,
        chord: { root: root, quality: quality },
      })
      const bassList = string
        ? GuitarNote.onString(string, bassNote)
        : GuitarNote.onString(6, bassNote).concat(
            GuitarNote.onString(5, bassNote)
          )
      chords = chords.concat(
        bassList.map((bass) => ({
          name: `${Note.toDisplayString(root)}${Quality.toLeadSheet(quality)}${
            inversion === Inversion.Root
              ? ""
              : `/${Note.toDisplayString(bassNote)}`
          }`,
          notes: ChordPattern.generate(bass.string, quality, inversion).map(
            (note) => ({
              string: note.string,
              fret: note.fret + bass.fret,
            })
          ),
        }))
      )
    }

    // If any of the chords are invalid, filter them out
    return chords
      .filter(
        (chord) =>
          !chord.notes.some(
            (note) => note.fret < lowestFret || note.fret > fretsCount
          )
      )
      .sort(
        (chord1, chord2) =>
          Math.min(...chord1.notes.map((note) => note.fret)) -
          Math.min(...chord2.notes.map((note) => note.fret))
      )
      .sort(
        (chord2, chord1) =>
          Math.max(...chord1.notes.map((note) => note.string)) -
          Math.max(...chord2.notes.map((note) => note.string))
      )
  },
}

export type GuitarMusic = {
  key: { note: Note; mode?: Mode }
  chords: GuitarChord[]
}

export const GuitarMusic = {
  toTex(music: GuitarMusic) {
    return `\\ks ${Note.toDisplayString(music.key.note)} ${music.chords
      .map((chord) => GuitarChord.toTex(chord))
      .join("")}`
  },
}
