import { rotateBy } from "../../helpers"

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
  next(letter: Letter): Letter {
    switch (letter) {
      case "C":
        return "D"
      case "D":
        return "E"
      case "E":
        return "F"
      case "F":
        return "G"
      case "G":
        return "A"
      case "A":
        return "B"
      case "B":
        return "C"
    }
  },

  shift(number: number, letter: Letter): Letter {
    switch (number) {
      case 0:
        return letter
      default:
        return this.shift(number - 1, this.next(letter))
    }
  },
}

console.log(Letter.shift(5, "A"))

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

export enum Interval {
  unison,
  m2,
  M2,
  aug2,
  m3,
  M3,
  P4,
  aug4,
  dim5,
  P5,
  m6,
  M6,
  dim7,
  m7,
  M7,
  octave,
  step,
  halfStep,
}
export namespace Interval {
  export function halfSteps(interval: Interval | number): number {
    switch (interval) {
      case Interval.unison:
        return 0
      case Interval.m2:
        return 1
      case Interval.M2:
        return 2
      case Interval.aug2:
        return 3
      case Interval.m3:
        return 3
      case Interval.M3:
        return 4
      case Interval.P4:
        return 5
      case Interval.aug4:
        return 6
      case Interval.dim5:
        return 6
      case Interval.P5:
        return 7
      case Interval.m6:
        return 8
      case Interval.M6:
        return 9
      case Interval.dim7:
        return 9
      case Interval.m7:
        return 10
      case Interval.M7:
        return 11
      case Interval.octave:
        return 12
      case Interval.halfStep:
        return 1
      case Interval.step:
        return 2
      default:
        return interval
    }
  }
  export function shiftAmount(interval: Interval): number {
    switch (interval) {
      case Interval.unison:
        return 0
      case Interval.m2:
        return 1
      case Interval.M2:
        return 1
      case Interval.aug2:
        return 1
      case Interval.m3:
        return 2
      case Interval.M3:
        return 2
      case Interval.P4:
        return 3
      case Interval.aug4:
        return 3
      case Interval.dim5:
        return 4
      case Interval.P5:
        return 4
      case Interval.m6:
        return 5
      case Interval.M6:
        return 5
      case Interval.dim7:
        return 6
      case Interval.m7:
        return 6
      case Interval.M7:
        return 6
      case Interval.octave:
        return 7
      case Interval.halfStep:
        return 1
      case Interval.step:
        return 1
      default:
        return 0
    }
  }
}

/** Distinct number representations of notes to easily calculate intervals */
export type NoteNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export const NoteNumber = {
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

const octaves = [0, 1, 2, 3, 4, 5, 6]

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

  interval(note1: Note, note2: Note): Interval {
    var letterDifference = 1
    var currentLetter = note1.letter
    while (currentLetter !== note2.letter) {
      currentLetter = Letter.next(currentLetter)
      letterDifference++
    }
    Note.toNoteNumber(note2) - Note.toNoteNumber(note1)

    return Interval.M2
  },

  toDisplayString(note: Note): string {
    return `${note.letter}${Accidental.toDisplayString(note.accidental)}`
  },
  transpose(interval: Interval, n: Note): Note {
    const letter = Letter.shift(Interval.shiftAmount(interval), n.letter)

    const accidentental =
      NoteNumber.increaseBy(
        Interval.halfSteps(interval),
        Note.toNoteNumber(n)
      ) - Note.toNoteNumber(note(letter))

    return note(letter, accidentental)
  },
  toMidiNumber(note: Note, octave: number) {
    return Note.toNoteNumber(note) + 12 + octave * 12
  },
  toMidiNumbersForAllOctaves(note: Note): number[] {
    return octaves.map((octave) => Note.toMidiNumber(note, octave))
  },
  fromMidiNumber(midiNum: number) {
    return NoteNumber.toNote((midiNum % 12) as NoteNumber)
  },
}

console.log("Testing MIDI ", Note.toMidiNumber(note("C"), 4))

console.log("interval", Note.transpose(Interval.aug2, note("C")))

export function note(letter: Letter, accidental?: Accidental): Note {
  return {
    letter: letter,
    accidental: accidental ? accidental : Accidental.Natural,
  }
}

export type OctavedNote = { note: Note; octave: number }
export namespace OctavedNote {
  export function fromMidiNumber(midiNumber: number): OctavedNote {
    return {
      note: NoteNumber.toNote((midiNumber % 12) as NoteNumber),
      octave: midiNumber / 12,
    }
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
}

export enum Mode {
  Ionian,
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  Aeloian,
  Locrian,
}

type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type Scale = Interval[]
export namespace Scale {
  export const MajorScale: Scale = [
    Interval.step,
    Interval.step,
    Interval.halfStep,
    Interval.step,
    Interval.step,
    Interval.step,
    Interval.halfStep,
  ]

  export const HarmonicMinor: Scale = [
    Interval.step,
    Interval.halfStep,
    Interval.step,
    Interval.step,
    Interval.halfStep,
    Interval.aug2,
    Interval.halfStep,
  ]

  export const MinorScale = mode(Mode.Aeloian)

  export function mode(mode: Mode): Scale {
    return rotateBy(mode, MajorScale)
  }
}

type Triad = [Interval, Interval]
type Seventh = [Interval, Interval, Interval]

type ChordStructure = Triad | Seventh | Interval[]
const ChordStructure = {
  isTriad(chord: ChordStructure): chord is Triad {
    return chord.length === 2
  },
  isSeventh(chord: ChordStructure): chord is Seventh {
    return chord.length === 3
  },

  toQuality(chord: ChordStructure): Quality | null {
    // If chord it's seventh chord
    if (this.isSeventh(chord)) {
      switch (chord[0]) {
        case Interval.m3:
          switch (chord[1]) {
            case Interval.m3:
              switch (chord[2]) {
                case Interval.m3:
                  return Quality.Full
                case Interval.M3:
                  return Quality.Half
                default:
                  return null
              }
            case Interval.M3:
              switch (chord[2]) {
                case Interval.m3:
                  return Quality.Min7
                default:
                  return null
              }
            default:
              return null
          }
        case Interval.M3:
          switch (chord[1]) {
            case Interval.m3:
              switch (chord[2]) {
                case Interval.m3:
                  return Quality.Dom7
                case Interval.M3:
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
      switch (chord[0]) {
        case Interval.m3:
          switch (chord[1]) {
            case Interval.m3:
              return Quality.Dim
            case Interval.M3:
              return Quality.Min
            default:
              return null
          }
        case Interval.M3:
          switch (chord[1]) {
            case Interval.m3:
              return Quality.Maj
            case Interval.M3:
              return Quality.Aug
            default:
              return null
          }
        default:
          return null
      }
    } else return null
  },
}

function diatonicTriad(scaleDegree: ScaleDegree, scale: Scale): Triad {
  const mode = rotateBy(scaleDegree - 1, scale)
  return [mode[0] + mode[1], mode[2] + mode[3]]
}

function diatonicSeventh(scaleDegree: ScaleDegree, scale: Scale): Seventh {
  const mode = rotateBy(scaleDegree - 1, scale)
  return [mode[0] + mode[1], mode[2] + mode[3], mode[4] + mode[5]]
}

/** Returns all triads in a scale */
function allDiatonicTriads(scale: Scale): Triad[] {
  return scale.map((_, i) => diatonicTriad((i + 1) as ScaleDegree, scale))
}
/** Returns all seventh chords in a scale */
function allDiatonicSevenths(scale: Scale): Seventh[] {
  return scale.map((_, i) => diatonicSeventh((i + 1) as ScaleDegree, scale))
}

console.log(
  allDiatonicSevenths(Scale.mode(Mode.Mixolydian)).map((chord) =>
    ChordStructure.toQuality(chord)
  )
)

export type NamedChord = {
  root: Note
  quality: Quality
}
export const NamedChord = {
  toLeadSheet(chord: NamedChord): string {
    return Note.toDisplayString(chord.root) + Quality.toLeadSheet(chord.quality)
  },
}

export function diatonicNotesBasedOnRoot(root: Note, scale: Scale): Note[] {
  var currentNote = root
  return [
    root,
    ...scale.map((interval) => {
      currentNote = Note.transpose(interval, currentNote)
      return currentNote
    }),
  ]
}

export function diatonicTriadsBasedOnRoot(
  root: Note,
  scale: Scale
): NamedChord[] {
  return allDiatonicTriads(scale)
    .filter((triad) => ChordStructure.toQuality(triad))
    .map((triad, i) => {
      return {
        root: Note.transpose(
          scale
            .slice(0, i)
            .reduce<number>((partialSum, a) => partialSum + a, 0),
          root
        ),
        quality: ChordStructure.toQuality(triad)!,
      }
    })
}

export function diatonicSeventhsBasedOnRoot(
  root: Note,
  scale: Scale
): NamedChord[] {
  return allDiatonicSevenths(scale)
    .filter((seventh) => ChordStructure.toQuality(seventh))
    .map((seventh, i) => {
      return {
        root: Note.transpose(
          scale
            .slice(0, i)
            .reduce<number>((partialSum, a) => partialSum + a, 0),
          root
        ),
        quality: ChordStructure.toQuality(seventh)!,
      }
    })
}

console.log(
  "HALLELUJAH ",
  diatonicTriadsBasedOnRoot(note("C"), Scale.MajorScale).map((chord) =>
    NamedChord.toLeadSheet(chord)
  ),
  "DOUBLE HALLELUJAH",
  diatonicSeventhsBasedOnRoot(note("C"), Scale.MajorScale).map((chord) =>
    NamedChord.toLeadSheet(chord)
  )
)

type Key = {
  note: Note
  scale: Scale
}
const Key = {
  toTex(key: Key): string {
    return ``
  },
}
