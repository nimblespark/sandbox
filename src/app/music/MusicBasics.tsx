import { Accidental } from "./Accidental"
import { Interval } from "./Interval"
import { Letter } from "./Letter"
import { Note } from "./Note"
import { OctavedNote } from "./OctavedNote"

export const octaves = [0, 1, 2, 3, 4, 5, 6]

// console.log("Testing MIDI ", Note.toMidiNumber(note("C"), 4))

// console.log("transpose", Note.transpose(interval("aug2"), note("C")))

export function note(letter: Letter, accidental?: Accidental): Note {
  return {
    letter: letter,
    accidental: accidental ? accidental : Accidental.Natural,
  }
}
export function oNote(str: string, octave: number): OctavedNote {
  if (
    str.length === 0 ||
    !Letter.validLetters.includes(str.charAt(0) as Letter)
  )
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
