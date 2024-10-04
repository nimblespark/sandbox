import { Interval } from "./Interval"

type Letter = "A" | "B" | "C" | "D" | "E" | "F" | "G"
export namespace Letter {
  export const validLetters = ["A", "B", "C", "D", "E", "F", "G"]
  export function toNoteNumber(letter: Letter): NoteNumber {
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
  }
  export function next(letter: Letter): Letter {
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
  }

  export function shift(number: number, letter: Letter): Letter {
    switch (number) {
      case 0:
        return letter
      default:
        return shift(number - 1, next(letter))
    }
  }
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
  export function fromString(str: string) {
    switch (str) {
      case "b":
        return Accidental.Flat
      case "bb":
        return Accidental.DoubleFlat
      case "#":
        return Accidental.Sharp
      case "##":
        return Accidental.DoubleSharp
      default:
        throw new Error(`Accidental was ${str}`)
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
  toNoteSharp(number: NoteNumber): Note {
    switch (number) {
      case 0:
        return note("C")
      case 1:
        return note("C", Accidental.Sharp)
      case 2:
        return note("D")
      case 3:
        return note("D", Accidental.Sharp)
      case 4:
        return note("E")
      case 5:
        return note("F")
      case 6:
        return note("F", Accidental.Sharp)
      case 7:
        return note("G")
      case 8:
        return note("G", Accidental.Sharp)
      case 9:
        return note("A")
      case 10:
        return note("A", Accidental.Sharp)
      case 11:
        return note("B")
    }
  },
}

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
    console.log(note1, note2)
    console.log(
      "interval:",
      OctavedNote.interval(
        { note: note1, octave: 1 },
        { note: note2, octave: 2 }
      )
    )
    console.log(
      "simple interval:",
      Interval.toSimple(
        OctavedNote.interval(
          { note: note1, octave: 1 },
          { note: note2, octave: 2 }
        )
      )
    )
    return Interval.toSimple(
      OctavedNote.interval(
        { note: note1, octave: 1 },
        { note: note2, octave: 2 }
      )
    )
  },

  toDisplayString(note: Note): string {
    return `${note.letter}${Accidental.toDisplayString(note.accidental)}`
  },
  transpose(interval: Interval, n: Note): Note {
    const letter = Letter.shift(interval.n - 1, n.letter)

    const accidental =
      NoteNumber.increaseBy(
        Interval.halfSteps(interval),
        Note.toNoteNumber(n)
      ) - Note.toNoteNumber(note(letter))

    return note(letter, accidental)
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

// console.log("Testing MIDI ", Note.toMidiNumber(note("C"), 4))

// console.log("transpose", Note.transpose(interval("aug2"), note("C")))

export function note(letter: Letter, accidental?: Accidental): Note {
  return {
    letter: letter,
    accidental: accidental ? accidental : Accidental.Natural,
  }
}
export function oNote(str: string, octave: number): OctavedNote {
  if (str.length === 0 || !Letter.validLetters.includes(str.charAt(0)))
    throw new Error(
      `First letter of input string must be one of 'A B C D E F G'`
    )
  const letter = str.charAt(0) as Letter
  const accidental =
    str.length > 1
      ? Accidental.fromString(str.slice(1, str.length))
      : Accidental.Natural
  return { note: note(letter, accidental), octave: octave }
}

export function octavedNote(note: Note, octave: number): OctavedNote {
  return { note: note, octave: octave }
}

export type OctavedNote = { note: Note; octave: number }
export namespace OctavedNote {
  export function fromMidiNumber(midiNumber: number): OctavedNote {
    return {
      note: NoteNumber.toNote((midiNumber % 12) as NoteNumber),
      octave: Math.floor(midiNumber / 12),
    }
  }
  export function fromMidiNumberSharp(midiNumber: number): OctavedNote {
    return {
      note: NoteNumber.toNoteSharp((midiNumber % 12) as NoteNumber),
      octave: Math.floor(midiNumber / 12),
    }
  }
  export function toMidiNumber(note: OctavedNote) {
    return Note.toNoteNumber(note.note) + note.octave * 12
  }
  export function interval(note1: OctavedNote, note2: OctavedNote): Interval {
    var currentN = 1
    var currentLetter = note1.note.letter
    while (currentLetter !== note2.note.letter) {
      currentLetter = Letter.next(currentLetter)
      currentN++
    }
    const noteDifference = toMidiNumber(note2) - toMidiNumber(note1)
    const normalDifference = Interval.halfSteps({
      n: currentN,
      offset: 0,
    })
    const offset = noteDifference - normalDifference

    return { n: currentN, offset: offset }
  }
}
