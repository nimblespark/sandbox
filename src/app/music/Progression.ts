import { Key, NamedChord } from "./Music"
import { Note } from "./Note"
import { OctavedNote } from "./OctavedNote"
import { Scale, ScaleDegree } from "./Scale"

// type RelativeChord = {interval: Interval, quality: Quality}
// const RC = {
//   const
// }

export type SecondaryDominant = `5/${ScaleDegree}`

const rules: Record<
  ScaleDegree | SecondaryDominant,
  (ScaleDegree | SecondaryDominant)[]
> = {
  1: [1, 2, 3, 4, 5, 6, 7, "5/1", "5/4"],
  2: [2, 5, 7, "5/2", "5/5"],
  3: [3, 2, 4, 5, 6, 7, "5/3", "5/6"],
  4: [4, 2, 5, 6, 7, "5/4"],
  5: [5, 1, 2, 4, 6, "5/5", "5/1"],
  6: [6, 2, 4, "5/6", "5/2", "5/5"],
  7: [7, 1, 2, 4, 5],
  "5/1": [1],
  "5/2": [2],
  "5/3": [3],
  "5/4": [4],
  "5/5": [5],
  "5/6": [6],
  "5/7": [],
}

function isValidMovement(
  first: ScaleDegree | SecondaryDominant,
  second: ScaleDegree | SecondaryDominant
) {
  return rules[first].includes(second)
}

function isValidProgression(chords: ScaleDegree[]) {
  for (let i = 0; i < chords.length - 1; i++) {
    if (!isValidMovement(chords[i], chords[i + 1])) return false
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
