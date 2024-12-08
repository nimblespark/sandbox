import { expect, test } from "vitest"
import { FullChord } from "./FullChord"
import { Inversion } from "./Inversion"
import { note } from "./MusicBasics"
import { Quality } from "./Quality"
import { Note } from "./Note"
import { Accidental } from "./Accidental"

test("bass note of root pos chord should be first note", () => {
  var chord: FullChord = {
    chord: { root: note("C"), quality: Quality.Maj7 },
    inversion: Inversion.Root,
  }
  expect(Note.toDisplayString(FullChord.bassNote(chord))).toBe("C")

  var chord: FullChord = {
    chord: { root: note("D", Accidental.Sharp), quality: Quality.Maj7 },
    inversion: Inversion.Root,
  }
  expect(Note.toDisplayString(FullChord.bassNote(chord))).toBe("D#")
})
