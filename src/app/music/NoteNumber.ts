import { Accidental } from "./Accidental"
import { note } from "./MusicBasics"
import { Note } from "./Note"

/** Distinct number representations of notes to easily calculate intervals */
export type NoteNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export const NoteNumber = {
  increaseBy(number: number, noteNumber: NoteNumber): NoteNumber {
    return ((noteNumber + number + 12) % 12) as NoteNumber
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
