import { ChordStructure } from "./ChordStructure"
import { FullChord } from "./FullChord"
import { interval, Interval } from "./Interval"
import { Inversion } from "./Inversion"
import {
  convertIntervalsToThirds,
  intervalsFromNotes,
  NamedChord,
  octavedNotesToChord,
  RaisedFunction,
  rn,
  RomanNumeral,
  simplifyOctavedNotes,
} from "./Music"
import { note, oNote } from "./MusicBasics"
import { Note } from "./Note"
import { OctavedNote } from "./OctavedNote"
import { SecondaryFunction } from "./Progression"
import { Quality } from "./Quality"
import { Voice } from "./Voice"

type Match = { first: number; second: number }
export const Match = {
  compare(m1: Match, m2: Match) {
    return m1.first === m2.first && m1.second === m2.second
  },
}

export function compareAll<A>(
  pred: (a1: A, a2: A) => boolean,
  list: A[]
): Match[] {
  let matches = []
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (pred(list[i], list[j])) matches.push({ first: i, second: j })
    }
  }
  return matches
}

export function lookForInterval(
  interval: Interval,
  harm: OctavedHarmony
): { first: Voice; second: Voice }[] {
  return compareAll(
    (a1, a2) => Interval.compare(OctavedNote.interval(a1, a2), interval),
    harm
  )
}

export function voicesWithParallelFifths(
  harm1: OctavedHarmony,
  harm2: OctavedHarmony
): [Voice, Voice][] {
  const firstChordMatches = lookForInterval(interval("p5"), harm1)
  // console.log({ firstChordMatches })
  if (firstChordMatches.length === 0) return []
  const secondChordMatches = lookForInterval(interval("p5"), harm2)
  // console.log({ secondChordMatches })
  var voices: [Voice, Voice][] = []
  firstChordMatches.forEach((match1) =>
    secondChordMatches.forEach((match2) => {
      if (Match.compare(match1, match2))
        voices.push([match2.first, match2.second])
      return Match.compare(match1, match2)
    })
  )
  // matchFound ? console.log("parallel 5", harm1, harm2) : ""
  return voices
}

export function voicesWithParallel(
  interval: Interval,
  harm1: OctavedHarmony,
  harm2: OctavedHarmony
): [Voice, Voice][] {
  const firstChordMatches = lookForInterval(interval, harm1)
  // console.log({ firstChordMatches })
  if (firstChordMatches.length === 0) return []
  const secondChordMatches = lookForInterval(interval, harm2)
  // console.log({ secondChordMatches })
  var voices: [Voice, Voice][] = []
  firstChordMatches.forEach((match1) =>
    secondChordMatches.forEach((match2) => {
      if (Match.compare(match1, match2))
        voices.push([match2.first, match2.second])
      return Match.compare(match1, match2)
    })
  )
  return voices
}

export function voicesWithParallelOctaves(
  harm1: OctavedHarmony,
  harm2: OctavedHarmony
): [Voice, Voice][] {
  const firstChordMatches = [
    ...lookForInterval(interval("p8"), harm1),
    ...lookForInterval(interval("p15"), harm1),
  ]
  // console.log({ firstChordMatches })
  if (firstChordMatches.length === 0) return []
  const secondChordMatches = [
    ...lookForInterval(interval("p8"), harm2),
    ...lookForInterval(interval("p15"), harm2),
  ]
  // console.log({ secondChordMatches })
  var voices: [Voice, Voice][] = []
  firstChordMatches.forEach((match1) =>
    secondChordMatches.forEach((match2) => {
      if (Match.compare(match1, match2))
        voices.push([match2.first, match2.second])
      return Match.compare(match1, match2)
    })
  )
  // matchFound ? console.log("parallel 5", harm1, harm2) : ""
  return voices
}

export function identifyParallelOctaves(prog: OctavedHarmonyProgression) {
  const voicesPerBeat: Voice[][] = Array(prog.length).fill([])
  prog.forEach((curr, i) => {
    if (i === 0) return
    voicesPerBeat[i - 1] = [
      ...voicesPerBeat[i - 1],
      ...voicesWithParallelOctaves(prog[i - 1], curr).flatMap((a) => a),
    ]
    voicesPerBeat[i] = voicesWithParallelOctaves(prog[i - 1], curr).flatMap(
      (a) => a
    )
  })
  return voicesPerBeat
}

export function identifyParallel(
  interval: Interval,
  prog: OctavedHarmonyProgression
) {
  const voicesPerBeat: Voice[][] = Array(prog.length).fill([])
  prog.forEach((curr, i) => {
    if (i === 0) return
    voicesPerBeat[i - 1] = [
      ...voicesPerBeat[i - 1],
      ...voicesWithParallel(interval, prog[i - 1], curr).flatMap((a) => a),
    ]
    voicesPerBeat[i] = voicesWithParallel(interval, prog[i - 1], curr).flatMap(
      (a) => a
    )
  })
  return voicesPerBeat
}

type Rule = (harm1: OctavedHarmony, harm2: OctavedHarmony) => boolean
type ChordWithContext = {
  harm: OctavedHarmony
  numeral: RaisedFunction
}
type ContextualRule = (
  harm1: ChordWithContext,
  harm2: ChordWithContext
) => boolean

export const ContextualRule = {
  thirdOfVImproperResolution(harm1: ChordWithContext, harm2: ChordWithContext) {
    if (!Interval.compare(harm1.numeral[0].interval, interval("p5"))) {
      console.log("first chord is not a V")
      return false
    }
    if (
      harm2.numeral.length > 1 ||
      (!Interval.compare(harm2.numeral[0].interval, interval("p1")) &&
        !Interval.compare(harm2.numeral[0].interval, interval("M6")))
    ) {
      console.log("second chord is not a I or vi")
      return false
    }
    let isImproper = false
    OctavedHarmony.getChordalMember(3, harm1.harm).forEach((member) => {
      console.log("member", member)
      console.log(harm2.harm[member.voice])
      console.log(
        Interval.compare(
          OctavedNote.interval(member.note, harm2.harm[member.voice]),
          interval("m2")
        )
      )
      if (
        !Interval.compare(
          OctavedNote.interval(member.note, harm2.harm[member.voice]),
          interval("m2")
        )
      ) {
        console.log("third of V resolves improperly")
        isImproper = isImproper || true
      }
    })
    return isImproper
  },
}
export const ContextualRules: ContextualRule[] = [
  ContextualRule.thirdOfVImproperResolution,
]
export const Rule = {
  containsParallelFifths(harm1: OctavedHarmony, harm2: OctavedHarmony) {
    const firstChordMatches = lookForInterval(interval("p5"), harm1)
    //console.log({ firstChordMatches })
    if (firstChordMatches.length === 0) return false
    const secondChordMatches = lookForInterval(interval("p5"), harm2)
    //console.log({ secondChordMatches })
    const matchFound = firstChordMatches.some((match1) =>
      secondChordMatches.some((match2) => Match.compare(match1, match2))
    )
    matchFound ? console.log("parallel 5", harm1, harm2) : ""
    return matchFound
  },
  containsParallelOctaves(harm1: OctavedHarmony, harm2: OctavedHarmony) {
    const firstChordMatches = lookForInterval(interval("p8"), harm1)

    if (firstChordMatches.length === 0) return false
    const secondChordMatches = lookForInterval(interval("p8"), harm2)
    const matchFound = firstChordMatches.some((match1) =>
      secondChordMatches.some((match2) => Match.compare(match1, match2))
    )
    //matchFound ? console.log("parallel 8", harm1, harm2) : ""
    return matchFound
  },
  containsParallelFifteenths(harm1: OctavedHarmony, harm2: OctavedHarmony) {
    const firstChordMatches = lookForInterval(interval("p15"), harm1)

    if (firstChordMatches.length === 0) return false
    const secondChordMatches = lookForInterval(interval("p15"), harm2)
    const matchFound = firstChordMatches.some((match1) =>
      secondChordMatches.some((match2) => Match.compare(match1, match2))
    )
    //matchFound ? console.log("parallel 8", harm1, harm2) : ""
    return matchFound
  },

  voiceCrossing(harm1: OctavedHarmony, harm2: OctavedHarmony) {
    console.log("voice crossing", harm1, harm2)

    let crossing = false
    harm2.forEach((n2, i) => {
      if (harm1[i - 1]) {
        console.log(
          "comparing",
          harm1[i - 1],
          OctavedNote.toMidiNumber(harm1[i - 1]),
          `in voice ${i - 1} in first chord to ${
            n2.note.letter
          } #${OctavedNote.toMidiNumber(n2)}in voice ${i} in second chord`
        )
        console.log(
          OctavedNote.toMidiNumber(n2) <= OctavedNote.toMidiNumber(harm1[i - 1])
        )
        if (
          OctavedNote.toMidiNumber(n2) <= OctavedNote.toMidiNumber(harm1[i - 1])
        )
          crossing = true
      }
      if (harm1[i + 1]) {
        console.log(
          "comparing",
          harm1[i + 1],
          `in voice ${i + 1} in first chord to ${
            n2.note.letter
          } in voice ${i} in second chord`
        )
        if (
          OctavedNote.toMidiNumber(n2) >= OctavedNote.toMidiNumber(harm1[i + 1])
        )
          crossing = true
      }
    })
    return crossing
  },
  bigJump(harm1: OctavedHarmony, harm2: OctavedHarmony) {
    let jump = false
    harm1.forEach((n1, i) => {
      console.log(harm1, harm2)
      const interval = OctavedNote.interval(n1, harm2[i])
      console.log("interval", interval)
      if (
        Interval.halfSteps(interval) > 12 ||
        Interval.halfSteps(interval) < -12
      ) {
        jump = true || jump
      }
    })
    return jump
  },
}
export const Rules: Rule[] = [
  Rule.containsParallelFifths,
  Rule.containsParallelOctaves,
  Rule.containsParallelFifteenths,
  Rule.voiceCrossing,
  Rule.bigJump,
]

export type NamedOctavedHarmonyProgression = {
  chordNames: NamedChord[]
  progression: OctavedHarmonyProgression
}
export const NamedOctavedHarmonyProgression = {
  toTex(prog: NamedOctavedHarmonyProgression) {
    var result = ""
    prog.progression.forEach(
      (harm, i) =>
        (result +=
          OctavedHarmony.toTex(harm) + NamedChord.nameToTex(prog.chordNames[i]))
    )
    return result
  },
}

export type OctavedHarmonyProgression = OctavedHarmony[]
export const OctavedHarmonyProgression = {
  toTex(progression: OctavedHarmonyProgression) {
    var result = ""
    progression.map((harm) => (result += OctavedHarmony.toTex(harm)))
    return result
  },
  toABC(progression: OctavedHarmonyProgression) {
    var result = ""
    progression.map((harm) => (result += OctavedHarmony.toABC(harm)))
    return result
  },
  toUpperAndLower(progression: OctavedHarmonyProgression) {
    var upper: OctavedHarmonyProgression = []
    var lower: OctavedHarmonyProgression = []
    progression.forEach((chord) => {
      lower.push([chord[0], chord[1]])
      upper.push([chord[2], chord[3]])
    })
    return { upper: upper, lower: lower }
  },
  individualParts(progression: OctavedHarmonyProgression) {
    var bass: OctavedNote[] = []
    var tenor: OctavedNote[] = []
    var alto: OctavedNote[] = []
    var soprano: OctavedNote[] = []

    progression.forEach((chord) => {
      bass.push(chord[0])
      tenor.push(chord[1])
      alto.push(chord[2])
      soprano.push(chord[3])
    })
    return { bass, tenor, alto, soprano }
  },
}
type OctavedHarmonyPossibilities = OctavedNote[][]
export type OctavedHarmony = OctavedNote[]
export const OctavedHarmony = {
  getChordalMember(
    number: number,
    chord: OctavedHarmony
  ): { voice: Voice; note: OctavedNote }[] {
    console.log("getChord", chord)
    const simplifiedChord = simplifyOctavedNotes(chord)
    console.log("got here")
    const rootNum = convertIntervalsToThirds(
      intervalsFromNotes(simplifiedChord)
    )?.rootNum
    if (rootNum === undefined) throw new Error("rootNum is undefined")
    const root = simplifiedChord[rootNum].note
    let chordalMembers: { voice: Voice; note: OctavedNote }[] = []
    chord.forEach((oNote, i) => {
      if (Note.interval(root, oNote.note).n === number) {
        chordalMembers.push({ voice: i as Voice, note: oNote })
      }
    })
    return chordalMembers
  },
  toTex(harm: OctavedHarmony): string {
    var result = "("
    harm.map((n) => (result += `${OctavedNote.toTex(n)} `))
    return result + ")"
  },
  toABC(harm: OctavedHarmony): string {
    var result = "["
    harm.map((n) => (result += `${OctavedNote.toABC(n)}`))
    return result + "]"
  },
}
export type Harmony = Record<Voice, Note>
export const Harmony = {
  isValidMovement(o1: OctavedHarmony, o2: OctavedHarmony) {
    return Rules.every((rule) => rule(o1, o2) === false)
  },
  isValidMovementContext(o1: ChordWithContext, o2: ChordWithContext) {
    return (
      Rules.every((rule) => rule(o1.harm, o2.harm) === false) &&
      ContextualRules.every((rule) => rule(o1, o2) === false)
    )
  },
  findErrors(o1: OctavedHarmony, o2: OctavedHarmony) {},
  isValidHarmony(harm: OctavedHarmony): boolean {
    return (
      OctavedNote.toMidiNumber(harm[0]) < OctavedNote.toMidiNumber(harm[1]) &&
      OctavedNote.toMidiNumber(harm[1]) < OctavedNote.toMidiNumber(harm[2]) &&
      OctavedNote.toMidiNumber(harm[2]) < OctavedNote.toMidiNumber(harm[3]) &&
      Interval.halfSteps(OctavedNote.interval(harm[1], harm[2])) <= 12 &&
      Interval.halfSteps(OctavedNote.interval(harm[2], harm[3])) <= 12
    )
  },
  harmoniesFromNamedChords(
    chords: NamedChord[],
    melody?: OctavedNote[]
  ): OctavedHarmonyProgression {
    const firstChordPossibilities = this.generatePossibilities(chords[0])
      .flatMap((harmony) => {
        //console.log("first chord harmony", harmony)
        const result = this.possibilitiesToOctavedHarmonyOptions(
          this.possibilitiesWithinRanges(harmony)
        )
        //console.log("first chord result", result)
        return result
      })
      .filter(Harmony.isValidHarmony)

    const firstChordFilteredPossibilities = firstChordPossibilities.filter(
      (a) =>
        melody
          ? OctavedNote.toMidiNumber(a[3]) ===
            OctavedNote.toMidiNumber(melody[0])
          : true
    )

    const firstChord =
      firstChordFilteredPossibilities[
        Math.floor(Math.random() * firstChordFilteredPossibilities.length)
      ]
    const harmonies = [firstChord]
    for (let i = 0; i < chords.length - 1; i++) {
      harmonies.push(
        this.voiceLead(
          harmonies[i],
          chords[i + 1],
          melody ? melody[i + 1] : undefined
        )
      )
    }
    return harmonies
  },
  harmoniesFromNamedChordsContext(
    chords: NamedChord[],
    numerals: RaisedFunction[],
    melody?: OctavedNote[]
  ): OctavedHarmonyProgression {
    const firstChordPossibilities = this.generatePossibilities(chords[0])
      .flatMap((harmony) => {
        //console.log("first chord harmony", harmony)
        const result = this.possibilitiesToOctavedHarmonyOptions(
          this.possibilitiesWithinRanges(harmony)
        )
        //console.log("first chord result", result)
        return result
      })
      .filter(Harmony.isValidHarmony)

    const firstChordFilteredPossibilities = firstChordPossibilities.filter(
      (a) =>
        melody
          ? OctavedNote.toMidiNumber(a[3]) ===
            OctavedNote.toMidiNumber(melody[0])
          : true
    )

    const firstChord =
      firstChordFilteredPossibilities[
        Math.floor(Math.random() * firstChordFilteredPossibilities.length)
      ]
    const harmonies = [firstChord]
    for (let i = 0; i < chords.length - 1; i++) {
      harmonies.push(
        this.voiceLeadContext(
          { harm: harmonies[i], numeral: numerals[i] },
          chords[i + 1],
          numerals[i + 1],
          melody ? melody[i + 1] : undefined
        )
      )
    }
    return harmonies
  },

  totalMovement(o1: OctavedHarmony, o2: OctavedHarmony) {
    var total = 0
    if (o1.length !== o2.length) {
      // console.log({ o1 }, { o2 })
      throw new Error(
        `Harmonies don't have the same number of parts, ${o1.length}, ${o2.length}`
      )
    }
    for (let i = 1; i < o1.length; i++) {
      total += Math.pow(
        OctavedNote.toMidiNumber(o2[i]) - OctavedNote.toMidiNumber(o1[i]),
        2
      )
    }
    return total
  },
  voiceLead(
    h: OctavedHarmony,
    namedChord: NamedChord,
    sopranoNote?: OctavedNote
  ): OctavedHarmony {
    const allPossibilities = this.generatePossibilities(namedChord)
      .flatMap((harmony) => {
        //  console.log("HARMONY", harmony)

        const result = this.possibilitiesToOctavedHarmonyOptions(
          this.possibilitiesWithinRanges(harmony)
        )
        //  console.log({ result })
        return result
      })
      .filter(Harmony.isValidHarmony)
      .filter((harm) => Harmony.isValidMovement(h, harm))
    //console.log({ allPossibilities })

    const filteredPossibilities = sopranoNote
      ? allPossibilities.filter(
          (a) =>
            OctavedNote.toMidiNumber(a[3]) ===
            OctavedNote.toMidiNumber(sopranoNote)
        )
      : allPossibilities

    filteredPossibilities.sort(
      (a, b) => this.totalMovement(h, a) - this.totalMovement(h, b)
    )
    // how many of the first options to pick from
    const error = 1
    const offset = Math.floor(Math.random() * error)

    // console.log(
    //   "is valid movement",
    //   this.isValidMovement(h, filteredPossibilities[offset])
    // )
    return filteredPossibilities[offset]
  },
  voiceLeadContext(
    { numeral, harm: h }: ChordWithContext,
    namedChord: NamedChord,
    secondChordNumeral: RaisedFunction,
    sopranoNote?: OctavedNote
  ): OctavedHarmony {
    console.log("voice leading...")
    const allPossibilities = this.generatePossibilities(namedChord)
      .flatMap((harmony) => {
        //  console.log("HARMONY", harmony)

        const result = this.possibilitiesToOctavedHarmonyOptions(
          this.possibilitiesWithinRanges(harmony)
        )
        //  console.log({ result })
        return result
      })
      .filter(Harmony.isValidHarmony)
      .filter((harm) =>
        Harmony.isValidMovementContext(
          { harm: h, numeral: numeral },
          { harm: harm, numeral: secondChordNumeral }
        )
      )
    //console.log({ allPossibilities })

    const filteredPossibilities = sopranoNote
      ? allPossibilities.filter(
          (a) =>
            OctavedNote.toMidiNumber(a[3]) ===
            OctavedNote.toMidiNumber(sopranoNote)
        )
      : allPossibilities

    filteredPossibilities.sort(
      (a, b) => this.totalMovement(h, a) - this.totalMovement(h, b)
    )
    // how many of the first options to pick from
    const error = 1
    const offset = Math.floor(Math.random() * error)

    // console.log(
    //   "is valid movement",
    //   this.isValidMovement(h, filteredPossibilities[offset])
    // )
    return filteredPossibilities[offset]
  },
  generatePossibilities(chord: NamedChord): Harmony[] {
    if (Quality.isTriad(chord.quality)) {
      return doubleOneCombinations([
        // These toNormals shouldn't be necessary but alphaTex doesn't support strange accidentals
        Note.toNormal(
          FullChord.voice(0, { chord: chord, inversion: Inversion.Root })
        ),
        Note.toNormal(
          FullChord.voice(1, { chord: chord, inversion: Inversion.Root })
        ),
        Note.toNormal(
          FullChord.voice(2, { chord: chord, inversion: Inversion.Root })
        ),
      ]).map((pos) => {
        var harm: Harmony = {
          0: note("C"),
          1: note("C"),
          2: note("C"),
          3: note("C"),
        }
        pos.map((note, i) => (harm[i as Voice] = note))
        return harm
      })
    } else {
      return allCombinations([
        // These toNormals shouldn't be necessary but alphaTex doesn't support strange accidentals
        Note.toNormal(
          FullChord.voice(0, { chord: chord, inversion: Inversion.Root })
        ),
        Note.toNormal(
          FullChord.voice(1, { chord: chord, inversion: Inversion.Root })
        ),
        Note.toNormal(
          FullChord.voice(2, { chord: chord, inversion: Inversion.Root })
        ),
        Note.toNormal(
          FullChord.voice(3, { chord: chord, inversion: Inversion.Root })
        ),
      ]).map((pos) => {
        var harm: Harmony = {
          0: note("C"),
          1: note("C"),
          2: note("C"),
          3: note("C"),
        }
        pos.map((note, i) => (harm[i as Voice] = note))
        return harm
      })
    }
  },

  possibilitiesWithinRanges(harmony: Harmony): OctavedHarmonyPossibilities {
    var possibilities: OctavedHarmonyPossibilities = []
    Object.keys(harmony).map((v) => {
      const voice: Voice = Number(v)
      const range = Voice.range(voice)
      const note = harmony[voice]

      possibilities[voice] = Note.octavedNotesInRange(range, note)
    })
    //({ possibilities })
    return possibilities
  },

  possibilitiesToOctavedHarmonyOptions(
    possibilities: OctavedHarmonyPossibilities
  ): OctavedHarmony[] {
    if (possibilities.length === 0) return [[]]

    return possibilities[0].flatMap((note) => {
      return [
        ...this.possibilitiesToOctavedHarmonyOptions(
          possibilities.slice(1)
        ).map((option) => [note, ...option]),
      ]
    })
  },
}

console.log("generate Possibilities", {
  generatePossibilities: Harmony.generatePossibilities({
    root: note("C"),
    quality: Quality.Maj7,
  }),
})

console.log(
  "chordal members",
  OctavedHarmony.getChordalMember(3, [
    oNote("G", 3),
    oNote("D", 4),
    oNote("B", 4),
    oNote("G", 5),
  ])
)

// console.log([oNote("G", 3), oNote("D", 4), oNote("B", 4), oNote("G", 5)])

// console.log("B4", oNote("B", 4))

console.log(
  "improper resolution",
  ContextualRule.thirdOfVImproperResolution(
    {
      numeral: rn("V"),
      harm: [oNote("G", 3), oNote("D", 4), oNote("B", 4), oNote("G", 5)],
    },
    {
      numeral: rn("I"),
      harm: [oNote("E", 3), oNote("C", 4), oNote("C", 5), oNote("G", 5)],
    }
  )
)

console.log(
  "chordal members",
  OctavedHarmony.getChordalMember(3, [
    oNote("B", 4),
    oNote("D", 4),
    oNote("B", 5),
    oNote("G", 4),
  ])
)

export function doubleOneCombinations<A>(list: A[]): A[][] {
  return list.flatMap((num) => {
    return allCombinations(list).map((possibility) => [num, ...possibility])
  })
}
export function allCombinations<A>(list: A[]): A[][] {
  if (list.length === 0) return []
  if (list.length === 1) return [list]
  return list.flatMap((num, i) => {
    var newTail = [...list]
    //var temp = newTail[i]
    newTail[i] = list[0]
    newTail = newTail.slice(1)
    //console.log({ newTail })
    return allCombinations(newTail).map((possibility) => [num, ...possibility])
  })
}

console.log(
  "generate",
  Harmony.generatePossibilities({ root: note("C"), quality: Quality.Maj7 })
)

const harmony: Harmony = [note("C"), note("B"), note("G"), note("E")]
const withinRanges = Harmony.possibilitiesWithinRanges(harmony)

console.log("within ranges", withinRanges)

console.log(
  "harmony",
  Harmony.possibilitiesToOctavedHarmonyOptions(withinRanges)
)
