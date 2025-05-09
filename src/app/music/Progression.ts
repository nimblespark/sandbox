import { Key, NamedChord, RaisedFunction, rn, RomanNumeral } from "./Music"
import { Note } from "./Note"
import { OctavedNote } from "./OctavedNote"
import { Scale, ScaleDegree } from "./Scale"

// type RelativeChord = {interval: Interval, quality: Quality}
// const RC = {
//   const
// }

export type SecondaryDominant = `5/${ScaleDegree}`

export type SecondaryFunction = `${string}/${string}`

export function functionToNamedChord(
  tonic: Note,
  chord: string,
  options?: { allSevenths?: boolean }
): NamedChord {
  return RaisedFunction.toNamedChord(rn(chord), tonic)
}

const rules2: Record<string, string[]> = {
  I: ["ii", "iii", "IV", "V", "vi", "vii°", "V/ii", "V/IV"],
  ii: ["V", "vii°", "V/ii", "V/V"],
  iii: ["IV", "V", "vi", "V/iii", "V/vi"],
  IV: ["ii", "V", "iv", "vi", "vii°", "V/IV"],
  V: ["I", "ii", "vi", "V/V", "V/I", "i"],
  vi: ["ii", "IV", "V/vi", "V/ii", "V/V"],
  "vii°": ["I", "V"],
  "V/I": ["vi"],
  "V/ii": ["ii"],
  "V/iii": ["iii"],
  "V/IV": ["IV"],
  "V/V": ["V", "IV"],
  "V/vi": ["vi", "IV"],
  "V/vii°": [],
  i: ["ii°", "III", "iv", "v", "V", "VI", "VII"],
  "ii°": ["V"],
  III: ["iv", "V", "VI", "VII", "V/ii°"],
  iv: ["I", "ii°", "V", "VI", "VII"],
  v: ["i", "ii°", "iv", "VI"],
  VI: ["i", "ii°", "iv", "V"],
  VII: ["i", "ii°", "iv", "V"],
  "V/ii°": ["ii°"],
}

const rules: Record<
  ScaleDegree | SecondaryDominant,
  (ScaleDegree | SecondaryDominant)[]
> = {
  1: [1, 2, 3, 4, 5, 6, 7, "5/1", "5/4"],
  2: [2, 5, 7, "5/2", "5/5"],
  3: [3, 4, 5, 6, "5/3", "5/6"],
  4: [1, 4, 2, 5, 6, 7, "5/4"],
  5: [5, 1, 2, 4, 6, "5/5", "5/1"],
  6: [6, 2, 4, "5/6", "5/2", "5/5"],
  7: [7, 1, 5],
  "5/1": [1, 6],
  "5/2": [2],
  "5/3": [3],
  "5/4": [4],
  "5/5": [5],
  "5/6": [6, 4],
  "5/7": [],
}

function isValidMovement(
  first: ScaleDegree | SecondaryDominant,
  second: ScaleDegree | SecondaryDominant
) {
  return rules[first].includes(second)
}
function isValidMovement2(
  first: string | SecondaryFunction,
  second: string | SecondaryFunction
) {
  return rules2[first].includes(second)
}

function isValidProgression(chords: ScaleDegree[]) {
  for (let i = 0; i < chords.length - 1; i++) {
    if (!isValidMovement(chords[i], chords[i + 1])) return false
  }
  return true
}

function isValidProgression2(chords: string[]) {
  for (let i = 0; i < chords.length - 1; i++) {
    if (!isValidMovement2(chords[i], chords[i + 1])) return false
  }
  return true
}

export function findNLengthProgressions(
  length: number,
  start: ScaleDegree | SecondaryDominant,
  options?: Options
): (ScaleDegree | SecondaryDominant)[][] {
  if (length === 0) {
    return []
  }
  if (length === 1) {
    return [[start]]
  }

  var progs = rules[start].flatMap((chord) => [
    ...findNLengthProgressions(length - 1, chord).map((progression) => [
      start,
      ...progression,
    ]),
  ])

  if (options?.mustHaveSecondaryDominant) {
    console.log("filtering")
    progs = progs.filter((prog) =>
      prog.some((chord) => {
        return typeof chord === "string"
      })
    )
  }
  return progs
}

export function findNLengthProgressions2(
  length: number,
  start: string | SecondaryFunction,
  options?: Options
): (string | SecondaryFunction)[][] {
  if (length === 0) {
    return []
  }
  if (length === 1) {
    return [[start]]
  }

  var progs = rules2[start].flatMap((chord) => [
    ...findNLengthProgressions2(length - 1, chord).map((progression) => [
      start,
      ...progression,
    ]),
  ])
  return progs
}

type Options = {
  mustHaveSecondaryDominant: boolean
}
export function findNLengthProgressionsWithEnd(
  length: number,
  start: ScaleDegree | SecondaryDominant,
  end: ScaleDegree | SecondaryDominant,
  options?: Options
): (ScaleDegree | SecondaryDominant)[][] {
  var progs = findNLengthProgressions(length, start).filter(
    (progression) => progression[length - 1] === end
  )
  if (options?.mustHaveSecondaryDominant) {
    console.log("filtering")
    progs = progs.filter((prog) =>
      prog.some((chord) => {
        return typeof chord === "string"
      })
    )
  }
  return progs
}

export function findNLengthProgressionsWithEnd2(
  length: number,
  start: string | SecondaryFunction,
  end: string | SecondaryFunction,
  options?: Options
): (string | SecondaryFunction)[][] {
  var progs = findNLengthProgressions2(length, start).filter(
    (progression) => progression[length - 1] === end
  )
  if (options?.mustHaveSecondaryDominant) {
    console.log("filtering")
    progs = progs.filter((prog) =>
      prog.some((chord) => {
        return typeof chord === "string"
      })
    )
  }
  return progs
}

export function findProgresionForMelody(melody: OctavedNote[], key: Key) {
  const startingDegrees: ScaleDegree[] = [1, 2, 3, 4, 5, 6, 7]
  const possibilities = startingDegrees.flatMap((degree) =>
    findNLengthProgressions(melody.length, degree, {
      mustHaveSecondaryDominant: true,
    })
      .map((m) => {
        return m.map((degree) =>
          NamedChord.fromKeyAndScaleDegree(key, degree, false)
        )
      })
      .filter((progression) =>
        progression.every((chord, i) => {
          // console.log(chord)
          // console.log(NamedChord.toNotes(chord))
          return NamedChord.toNotes(chord)
            .map(Note.toNoteNumber)
            .includes(Note.toNoteNumber(melody[i].note))
        })
      )
  )

  return possibilities
}
