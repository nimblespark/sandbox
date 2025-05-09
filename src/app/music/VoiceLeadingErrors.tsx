import { red } from "@mui/material/colors"
import { Alpha } from "./Alpha"
import {
  identifyParallel,
  identifyParallelOctaves,
  NamedOctavedHarmonyProgression,
  OctavedHarmonyProgression,
  voicesWithParallelFifths,
  voicesWithParallelOctaves,
} from "./Harmony"
import { NamedChord } from "./Music"
import { note, oNote } from "./MusicBasics"
import { Quality } from "./Quality"
import { interval } from "./Interval"

const progression: NamedChord[] = [
  { root: note("G"), quality: Quality.Maj },
  { root: note("C"), quality: Quality.Maj },
  { root: note("E"), quality: Quality.Min },
  { root: note("D"), quality: Quality.Min },
  { root: note("A"), quality: Quality.Min },
  { root: note("G"), quality: Quality.Maj },
  { root: note("C"), quality: Quality.Maj },
]

const o1 = [oNote("G", 3), oNote("D", 4), oNote("B", 4), oNote("F", 5)]
const o2 = [oNote("C", 4), oNote("G", 4), oNote("C", 5), oNote("E", 5)]
const o3 = [oNote("E", 3), oNote("B", 3), oNote("G", 4), oNote("E", 5)]
const o4 = [oNote("A", 3), oNote("E", 4), oNote("C", 5), oNote("A", 5)]
const o5 = [oNote("D", 3), oNote("A", 3), oNote("F", 4), oNote("D", 5)]
const o6 = [oNote("G", 3), oNote("D", 4), oNote("B", 4), oNote("G", 5)]
const o7 = [oNote("C", 4), oNote("G", 4), oNote("E", 5), oNote("C", 6)]

const harmony: OctavedHarmonyProgression = [o1, o2, o3, o4, o5, o6, o7]

const allOctaves = identifyParallelOctaves(harmony)
const allFifths = identifyParallel(interval("p5"), harmony)

export function VoiceLeadingErrors() {
  const tex =
    progression &&
    harmony &&
    NamedOctavedHarmonyProgression.toTex({
      progression: harmony,
      chordNames: progression,
    })
  return (
    <div>
      {tex && (
        <Alpha
          name="Parallel Octaves"
          tex={tex}
          highlight={allOctaves}
          color={red[500]}
        />
      )}
      {tex && (
        <Alpha
          name="Parallel 5ths"
          tex={tex}
          highlight={allFifths}
          color={red[900]}
        />
      )}
    </div>
  )
}
