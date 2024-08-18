const fretsCount = 14
const lowestFret = 1

type Letter = "A" | "B" | "C" | "D" | "E" | "F" | "G"
const Letter = {
  toNoteNumber(letter: Letter): NoteNumber {
    switch (letter) {
      case "C":
        return 0
      case "D":
        return 2
      case "E":
        return 4
      case "F":
        return 5
      case "G":
        return 7
      case "A":
        return 9
      case "B":
        return 11
    }
  },
}

export enum Accidental {
  Natural = 0,
  Sharp = 1,
  Flat = -1,
  DoubleSharp = 2,
  DoubleFlat = -2,
}
export namespace Accidental {
  export function toDisplayString(accidental: Accidental) {
    switch (accidental) {
      case Accidental.Natural:
        return ""
      case Accidental.DoubleFlat:
        return "bb"
      case Accidental.Flat:
        return "b"
      case Accidental.Sharp:
        return "#"
      case Accidental.DoubleSharp:
        return "##"
    }
  }
}

enum Interval {
  unison = 0,
  m2 = 1,
  M2 = 2,
  m3 = 3,
  M3 = 4,
  P4 = 5,
  dim5 = 6,
  P5 = 7,
  m6 = 8,
  M6 = 9,
  m7 = 10,
  M7 = 11,
  octave = 12,
}

/** Distinct number representations of notes to easily calculate intervals */
type NoteNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
const NoteNumber = {
  increaseBy(number: number, noteNumber: NoteNumber): NoteNumber {
    return Math.abs((noteNumber + number) % 12) as NoteNumber
  },
  toNote(number: NoteNumber): Note {
    switch (number) {
      case 0:
        return note("C")
      case 1:
        return note("D", Accidental.Flat)
      case 2:
        return note("D")
      case 3:
        return note("E", Accidental.Flat)
      case 4:
        return note("E")
      case 5:
        return note("F")
      case 6:
        return note("G", Accidental.Flat)
      case 7:
        return note("G")
      case 8:
        return note("A", Accidental.Flat)
      case 9:
        return note("A")
      case 10:
        return note("B", Accidental.Flat)
      case 11:
        return note("B")
    }
  },
}
// console.log(NoteNumber.increaseBy(6, 11))

export type Note = {
  letter: Letter
  accidental: Accidental
}
export const Note = {
  toNoteNumber(note: Note): NoteNumber {
    return NoteNumber.increaseBy(
      note.accidental,
      Letter.toNoteNumber(note.letter)
    )
  },
  toDisplayString(note: Note): string {
    return `${note.letter}${Accidental.toDisplayString(note.accidental)}`
  },
  transpose(interval: Interval, note: Note): Note {
    return NoteNumber.toNote(
      NoteNumber.increaseBy(interval, Note.toNoteNumber(note))
    )
  },
}

console.log(Note.toDisplayString(Note.transpose(Interval.m3, note("C"))))

export function note(letter: Letter, accidental?: Accidental): Note {
  return {
    letter: letter,
    accidental: accidental ? accidental : Accidental.Natural,
  }
}

export enum Inversion {
  Root = "Root",
  First = "1st",
  Second = "2nd",
  Third = "3rd",
}
export namespace Inversion {
  export function bassNote(inversion: Inversion, quality: Quality, root: Note) {
    switch (inversion) {
      case Inversion.Root:
        return Note.transpose(Interval.unison, root)

      case Inversion.First:
        switch (quality) {
          case Quality.Maj7:
          case Quality.Dom7:
            return Note.transpose(Interval.M3, root)
          default:
            return Note.transpose(Interval.m3, root)
        }

      case Inversion.Second:
        switch (quality) {
          case Quality.Half:
          case Quality.Full:
            return Note.transpose(Interval.dim5, root)
          default:
            return Note.transpose(Interval.P5, root)
        }
      case Inversion.Third:
        switch (quality) {
          case Quality.Maj7:
            return Note.transpose(Interval.M7, root)
          case Quality.Dom7:
          case Quality.Min7:
          case Quality.Half:
            return Note.transpose(Interval.m7, root)
          default:
            return Note.transpose(Interval.M6, root)
        }
    }
  }
}

export enum Quality {
  Maj7 = "Maj7",
  Dom7 = "Dom7",
  Min7 = "Min7",
  Half = "Half-Dim7",
  Full = "Dim7",
}
export namespace Quality {
  export function toLeadSheet(quality: Quality) {
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
    }
  }
}

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

enum Mode {
  Ionian = 1,
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  Aeloian,
  Locrian,
}

type Triad = {
  1: Note
  2: Note
  3: Note
}

type Seventh = {
  1: Note
  2: Note
  3: Note
  4: Note
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
    console.log(fret)
    const listOfFrets = []
    while (fret <= fretsCount) {
      if (fret >= lowestFret) listOfFrets.push(fret)
      currentNote += Interval.octave
      fret = currentNote - Note.toNoteNumber(String.firstNote(string))
    }
    return listOfFrets.map((f) => ({ string: string, fret: f }))
  },
}

console.log(GuitarNote.onString(2, note("B")).map((note) => note.fret))

function g(string: String, fret: number): GuitarNote {
  return { string, fret }
}

type Key = {
  note: Note
  mode: Mode
}
const Key = {
  toTex(key: Key): string {
    return ``
  },
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
                return [g(5, 0), g(4, 0), g(3, -1), g(2, 2)]
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
      const bassNote = Inversion.bassNote(inversion, quality, root)
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

type Chord = Note[]

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
