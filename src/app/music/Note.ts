import { Accidental } from "./Accidental"
import { Interval } from "./Interval"
import { Letter } from "./Letter"
import { note, octavedNote, octaves } from "./MusicBasics"
import { NoteNumber } from "./NoteNumber"
import { OctavedNote } from "./OctavedNote"
import { Range } from "./Voice"

export type Note = {
  letter: Letter
  accidental: Accidental
}
export const Note = {
  octavedNotesInRange(range: Range, note: Note) {
    return octaves
      .map((octave) => octavedNote(note, octave))
      .filter((on) => Range.includes(on, range))
  },
  random(): Note {
    return {
      letter: Letter.random(),
      accidental: Math.floor(Math.random() * 3) - 1,
    }
  },
  toNoteNumber(note: Note): NoteNumber {
    return NoteNumber.increaseBy(
      note.accidental,
      Letter.toNoteNumber(note.letter)
    )
  },

  interval(note1: Note, note2: Note): Interval {
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
  /**
   * Remove unecessary accidentals (E# -> F, B# -> C) and vice versa (Fb -> E, Cb -> B)
   * @param n
   * @returns
   */
  toNormal(n: Note) {
    if (n.letter === "E" && n.accidental === 1) return note("F")
    if (n.letter === "F" && n.accidental === -1) return note("E")
    if (n.letter === "B" && n.accidental === 1) return note("C")
    if (n.letter === "C" && n.accidental === -1) return note("B")

    if (n.accidental > 1 || n.accidental < -1)
      return this.fromMidiNumber(this.toMidiNumber(n, 4))

    return n
  },
}
