import { Accidental } from "./Accidental"
import { Interval } from "./Interval"
import { Letter } from "./Letter"
import { oNote } from "./MusicBasics"
import { Note } from "./Note"
import { NoteNumber } from "./NoteNumber"

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
  /**
   * Intervals should be in ascending order
   * @param note1
   * @param note2
   * @returns
   */
  export function interval(note1: OctavedNote, note2: OctavedNote): Interval {
    var currentN = 1
    var currentLetter = note1.note.letter
    var octaveDiff = note2.octave - note1.octave
    while (currentLetter !== note2.note.letter || octaveDiff > 0) {
      if (currentLetter === "B") octaveDiff--
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
  export function toTex(octavedNote: OctavedNote): string {
    return Note.toDisplayString(octavedNote.note) + octavedNote.octave
  }

  export function fromABC(abc: string): OctavedNote {
    var accidental = ""
    accidental = ""
    if (/^__/.test(abc)) accidental = "bb"
    else if (/^_/.test(abc)) accidental = "b"
    else if (/^\^\^/.test(abc)) accidental = "##"
    else if (/^\^/.test(abc)) accidental = "#"
    var abc = abc.slice(accidental.length)

    if (/^[CDEFGAB],,$/.test(abc)) return oNote(abc.charAt(0) + accidental, 2)
    if (/^[CDEFGAB],$/.test(abc)) return oNote(abc.charAt(0) + accidental, 3)
    if (/^[CDEFGAB]$/.test(abc)) return oNote(abc + accidental, 4)
    if (/^[cdefgab]$/.test(abc)) return oNote(abc.toUpperCase() + accidental, 5)
    if (/^[cdefgab]'$/.test(abc))
      return oNote(abc.charAt(0).toUpperCase() + accidental, 6)
    throw new Error(`${abc} doesn't match any case`)
  }
  export function fromManyABC(abc: String): OctavedNote[] {
    const notes = abc.match(/[_^]?[_^]?[A-Ga-g][',]?/g) ?? []
    return notes.map((note) => fromABC(note))
  }
  export function toABC(note: OctavedNote): string {
    const acc = Accidental.toABC(note.note.accidental)
    const letter = note.note.letter
    switch (note.octave) {
      case 2:
        return `${acc}${letter},,`
      case 3:
        return `${acc}${letter},`
      case 4:
        return `${acc}${letter}`
      case 5:
        return `${acc}${letter.toLowerCase()}`
      case 6:
        return `${acc}${letter.toLowerCase()}'`
    }
    return `${acc}`
  }
}
