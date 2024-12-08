import { rotateBy } from "../helpers"
import { ChordStructure, Seventh, Shell, Triad } from "./ChordStructure"
import { FullChord } from "./FullChord"
import { Interval, interval } from "./Interval"
import { Inversion } from "./Inversion"
import { note } from "./MusicBasics"
import { Note } from "./Note"
import { OctavedNote } from "./OctavedNote"
import { SecondaryDominant } from "./Progression"
import { Quality } from "./Quality"
import { Scale, ScaleDegree } from "./Scale"

function diatonicTriad(scaleDegree: ScaleDegree, scale: Scale): Triad {
  const mode = rotateBy(scaleDegree - 1, scale)
  return [
    Interval.add2(mode[0], mode[1]),
    Interval.add2(mode[2], mode[3]),
  ] as Triad
}

function diatonicSeventh(scaleDegree: ScaleDegree, scale: Scale): Seventh {
  const mode = rotateBy(scaleDegree - 1, scale)
  return [
    Interval.add2(mode[0], mode[1]),
    Interval.add2(mode[2], mode[3]),
    Interval.add2(mode[4], mode[5]),
  ] as Seventh
}

/** Returns intervals of all triads in a scale */
function allDiatonicTriads(scale: Scale): Triad[] {
  return scale.map((_, i) => diatonicTriad((i + 1) as ScaleDegree, scale))
}
/** Returns intervals of all seventh chords in a scale */
function allDiatonicSevenths(scale: Scale): Seventh[] {
  return scale.map((_, i) => diatonicSeventh((i + 1) as ScaleDegree, scale))
}

export type NamedChord = {
  root: Note
  quality: Quality
}
export const NamedChord = {
  toSecondaryDominant(chord: NamedChord): NamedChord {
    var quality = Quality.Maj
    if (chord.quality === "Maj") {
      quality = Quality.Dom7
    }

    return { root: chord.root, quality: quality }
  },
  toLeadSheet(chord: NamedChord): string {
    return Note.toDisplayString(chord.root) + Quality.toLeadSheet(chord.quality)
  },
  fromKeyAndScaleDegree(
    key: Key,
    degree: ScaleDegree | SecondaryDominant,
    seventhChords: boolean = false
  ): NamedChord {
    if (typeof degree === "string") {
      const tonicizedNote = Number(degree.split("/")[1])
      const dominant = tonicizedNote + 4

      var chords
      if (!seventhChords) {
        chords = diatonicTriadsBasedOnRoot(key.note, key.scale)
      } else {
        chords = diatonicSeventhsBasedOnRoot(key.note, key.scale)
      }
      return NamedChord.toSecondaryDominant(chords[(dominant - 1) % 7])
    } else {
      var chords
      if (!seventhChords) {
        chords = diatonicTriadsBasedOnRoot(key.note, key.scale)
      } else {
        chords = diatonicSeventhsBasedOnRoot(key.note, key.scale)
      }
      return chords[degree - 1]
    }
  },
  toNotes(namedChord: NamedChord) {
    var prev = namedChord.root
    const otherNotes = Quality.toIntervals(namedChord.quality).map(
      (interval) => {
        const newNote = Note.transpose(interval, prev)
        prev = newNote
        return newNote
      }
    )
    return [namedChord.root, ...otherNotes]
  },
  nameToTex(namedChord: NamedChord) {
    return `{ch "${Note.toDisplayString(namedChord.root)}${Quality.toLeadSheet(
      namedChord.quality
    )}"}`
  },
}

export function diatonicNotesBasedOnRoot(root: Note, scale: Scale): Note[] {
  var currentNote = root
  return [
    root,
    ...scale.map((interval) => {
      currentNote = Note.transpose(interval, currentNote)
      return currentNote
    }),
  ]
}

export function diatonicTriadsBasedOnRoot(
  root: Note,
  scale: Scale
): NamedChord[] {
  return allDiatonicTriads(scale)
    .filter((triad) => ChordStructure.toQuality(triad))
    .map((triad, i) => {
      return {
        root: Note.transpose(
          Interval.add(scale.slice(0, i)),
          // .reduce<Interval>(
          //   (partialSum, a) => Interval.add2(partialSum, a),
          //   Interval.unison
          // ),
          root
        ),
        quality: ChordStructure.toQuality(triad)!,
      }
    })
}

console.log(
  "diatonic triads in c",
  diatonicTriadsBasedOnRoot(note("C"), Scale.MajorScale)
)

export function diatonicSeventhsBasedOnRoot(
  root: Note,
  scale: Scale
): NamedChord[] {
  return allDiatonicSevenths(scale)
    .filter((seventh) => ChordStructure.toQuality(seventh))
    .map((seventh, i) => {
      return {
        root: Note.transpose(
          scale
            .slice(0, i)
            .reduce<Interval>(
              (partialSum, a) => Interval.add2(partialSum, a),
              Interval.unison
            ),
          root
        ),
        quality: ChordStructure.toQuality(seventh)!,
      }
    })
}

export function intervalFromScaleAndDegree(
  scale: Scale,
  degree: ScaleDegree
): Interval {
  const intervals = scale.slice(0, degree - 1)
  return Interval.add(intervals)
}

export type Key = {
  note: Note
  scale: Scale
}
export const Key = {
  toTex(key: Key): string {
    return ``
  },
}

/**
 * Will convert any music concept to a string
 * @returns
 */
export function musicPrint(n: any): string {
  return ""
}

export function intervalsFromNotes(notes: OctavedNote[]): Interval[] {
  if (notes.length < 2) return []
  const currentIntervals = []
  for (let i = 0; i < notes.length - 1; i++) {
    currentIntervals.push(OctavedNote.interval(notes[i], notes[i + 1]))
  }
  return currentIntervals
}

/**
 * Must take a root position shell chord (3rd followed by 5th)
 * @param intervals
 */
function rootPositionShellToSeventh(intervals: Shell): Seventh {
  const firstInterval = intervals[0]
  const fifth = Interval.subtract(
    interval("p5"),
    intervals[0]
  ) as Interval.Third
  const seventh = Interval.subtract(intervals[1], fifth) as Interval.Third

  return [firstInterval, fifth, seventh]
}
// console.log(
//   "TESTING SHELL",
//   Scale.toDisplayString(
//     rootPositionShellToSeventh([
//       { n: 3, offset: 0 },
//       { n: 5, offset: 0 },
//     ])
//   )
// )
export function convertIntervalsToThirds(
  intervals: Interval[]
): { intervals: Interval[]; inversion: Inversion; rootNum: number } | null {
  if (intervals.every((interval) => interval.n == 3))
    return { intervals: intervals, inversion: Inversion.Root, rootNum: 0 }

  if (ChordStructure.isShell(intervals))
    return {
      intervals: rootPositionShellToSeventh(intervals),
      inversion: Inversion.Root,
      rootNum: 0,
    }

  var newIntervalList = intervals

  for (let i = 0; i < intervals.length; i++) {
    // console.log(i, Scale.toDisplayString(newIntervalList))
    //console.log("inverted", Interval.invert(newIntervalList[0]))
    const newInterval = Interval.subtract(
      Interval.invert(newIntervalList[0]),
      Interval.add(newIntervalList.slice(1, newIntervalList.length))
    )
    //console.log("interval to add on top", newInterval)
    const remainingIntervals = newIntervalList.slice(1, intervals.length)
    //console.log({ remainingIntervals })
    newIntervalList = [
      ...newIntervalList.slice(1, intervals.length),
      newInterval,
    ]

    const isSeventh = ChordStructure.isSeventh(newIntervalList)

    const isShell = ChordStructure.isShell(newIntervalList)

    const rootNum = i + 1

    const inversion =
      rootNum === 0
        ? Inversion.Root
        : isSeventh
        ? 4 - rootNum
        : isShell
        ? rootNum === 1
          ? 3
          : 1
        : 3 - rootNum

    if (newIntervalList.every((interval) => interval.n == 3))
      return {
        intervals: newIntervalList,
        inversion: inversion,
        rootNum: rootNum,
      }

    if (ChordStructure.isShell(newIntervalList)) {
      return {
        intervals: rootPositionShellToSeventh(newIntervalList),
        inversion: inversion,
        rootNum: rootNum,
      }
    }
  }

  return null
}

//console.log("XXXX ", convertIntervalsToThirds(MajorTriad))

//console.log("subtrackt", Interval.subtract(interval("p5"), interval("M3")))

export function octavedNotesToChord(
  currentOctavedNotes: OctavedNote[]
): FullChord | null {
  const bassNote =
    currentOctavedNotes.length > 0 ? currentOctavedNotes[0] : null

  var simplifiedOctavedNotes: OctavedNote[] = bassNote ? [bassNote] : []

  currentOctavedNotes.forEach((potential) => {
    // if this is a unique note, add it to the simplified list in it's lowest position that's still above the bass
    if (
      !simplifiedOctavedNotes.some(
        (element) =>
          Note.toNoteNumber(element.note) === Note.toNoteNumber(potential.note)
      )
    ) {
      var noteToAdd = potential
      while (
        bassNote &&
        OctavedNote.toMidiNumber(potential) >
          OctavedNote.toMidiNumber(bassNote) + 11
      ) {
        noteToAdd.octave--
      }
      simplifiedOctavedNotes.push(noteToAdd)
      console.log({ simplifiedOctavedNotes })
    }
  })

  simplifiedOctavedNotes.sort(
    (a, b) => OctavedNote.toMidiNumber(a) - OctavedNote.toMidiNumber(b)
  )

  console.log("Finished notes", simplifiedOctavedNotes)

  const currentChordAndRoot = convertIntervalsToThirds(
    intervalsFromNotes(simplifiedOctavedNotes)
  )
  const chordQuality =
    currentChordAndRoot &&
    ChordStructure.toQuality(currentChordAndRoot.intervals)

  const namedChord = currentChordAndRoot &&
    simplifiedOctavedNotes[currentChordAndRoot.rootNum] && {
      root: simplifiedOctavedNotes[currentChordAndRoot.rootNum].note,
      quality: chordQuality,
    }

  return (
    namedChord &&
    namedChord.quality && {
      chord: { root: namedChord.root, quality: namedChord.quality },
      inversion: currentChordAndRoot.inversion,
    }
  )
}

export function fullChordAndKeyToRomanNumeral(
  fullChord: FullChord,
  key: Key
): RomanNumeral {
  const interval = Note.interval(key.note, fullChord.chord.root)
  return {
    interval: interval,
    quality: fullChord.chord.quality,
    inversion: fullChord.inversion,
  }
}

type RomanNumeral = {
  interval: Interval
  quality: Quality
  inversion: Inversion
}

export namespace RomanNumeral {
  export function toDisplayString(roman: RomanNumeral) {
    if (roman.interval.n < 1 || roman.interval.n > 7)
      throw new Error(
        `Interval has to be a possible scale degree but was ${Interval.name(
          roman.interval
        )}`
      )
    const isMajor = Quality.isMajor(roman.quality)
    const isSeventh = Quality.isSeventh(roman.quality)
    var n: string
    switch (roman.interval.n) {
      case 1:
        n = isMajor ? "I" : "i"
        break
      case 2:
        n = isMajor ? "II" : "ii"
        break
      case 3:
        n = isMajor ? "III" : "iii"
        break
      case 4:
        n = isMajor ? "IV" : "iv"
        break
      case 5:
        n = isMajor ? "V" : "v"
        break
      case 6:
        n = isMajor ? "VI" : "vi"
        break
      case 7:
        n = isMajor ? "VII" : "vii"
        break
      default:
        throw new Error()
    }

    if (roman.quality === Quality.Full || roman.quality === Quality.Dim)
      n += "°"
    else if (roman.quality === Quality.Half) n += "ø"
    var suffix: string

    if (isSeventh) {
      switch (roman.inversion) {
        case Inversion.Root:
          suffix = "7"
          break
        case Inversion.First:
          suffix = "65"
          break
        case Inversion.Second:
          suffix = "43"
          break
        case Inversion.Third:
          suffix = "2"
          break
      }
    } else {
      switch (roman.inversion) {
        case Inversion.Root:
          suffix = ""
          break
        case Inversion.First:
          suffix = "6"
          break
        case Inversion.Second:
          suffix = "64"
          break
        default:
          throw new Error("Can't have a third inversion on a triad")
      }
    }
    return n + suffix
  }
}

console.log(
  "test",
  Note.transpose(
    Scale.MajorScale.slice(0, 4).reduce<Interval>(
      (partialSum, a) => Interval.add2(partialSum, a),
      Interval.unison
    ),
    note("C")
  )
)

console.log(
  "interval",
  Scale.MajorScale.slice(0, 4).reduce<Interval>(
    (partialSum, a) => Interval.add2(partialSum, a),
    Interval.unison
  )
)

console.log(
  "intervals",
  Scale.MajorScale.slice(0, 4)
  // .reduce<Interval>(
  //   (partialSum, a) => Interval.add2(partialSum, a),
  //   Interval.unison
  // )
)
