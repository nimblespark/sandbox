import { rotateBy } from "../helpers"
import { Accidental } from "./Accidental"
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

export type FiguredBass = "6" | "64" | "7" | "65" | "43" | "42" | undefined
export const FiguredBass = {
  isSeventh: (figuredBass: FiguredBass): boolean => {
    return (
      figuredBass === "7" ||
      figuredBass === "65" ||
      figuredBass === "43" ||
      figuredBass === "42"
    )
  },
}

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
    const newInterval = Interval.subtract(
      Interval.invert(newIntervalList[0]),
      Interval.add(newIntervalList.slice(1, newIntervalList.length))
    )
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

/**
 *
 * @param currentOctavedNotes
 * @returns the notes simplified to the lowest octave above the bass note
 */
export function simplifyOctavedNotes(currentOctavedNotess: OctavedNote[]) {
  console.log("simplifying", currentOctavedNotess.map(OctavedNote.toTex))
  const currentOctavedNotes = [...currentOctavedNotess]
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
        OctavedNote.toMidiNumber(noteToAdd) >
          OctavedNote.toMidiNumber(bassNote) + 11
      ) {
        noteToAdd = { note: potential.note, octave: noteToAdd.octave - 1 }
      }
      simplifiedOctavedNotes.push(noteToAdd)
    }
  })

  simplifiedOctavedNotes.sort(
    (a, b) => OctavedNote.toMidiNumber(a) - OctavedNote.toMidiNumber(b)
  )

  return simplifiedOctavedNotes
}

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
        OctavedNote.toMidiNumber(noteToAdd) >
          OctavedNote.toMidiNumber(bassNote) + 11
      ) {
        noteToAdd = { note: potential.note, octave: noteToAdd.octave - 1 }
      }
      simplifiedOctavedNotes.push(noteToAdd)
    }
  })

  simplifiedOctavedNotes.sort(
    (a, b) => OctavedNote.toMidiNumber(a) - OctavedNote.toMidiNumber(b)
  )

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

export type RomanNumeral = {
  interval: Interval
  quality: Quality
  inversion: Inversion
}

export const RomanNumeral = {
  toDisplayString(roman: RomanNumeral) {
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
  },
  fromString(string: string): RomanNumeral {
    const match = string.match(
      /(?<accidental>[♭#♮])?(?<rn>[IViv]+)(?<quality>[°ø])?(?<inv>64|65|43|42|66|6|7)?/
    )
    if (!match) throw new Error(`Invalid roman numeral: ${string}`)
    const accidental = match[1]
    const romanNumeral = match[2]
    const symbol = match[3]
    const figuredBass = match[4] as FiguredBass
    var inter: Interval = interval("p1")
    var quality: Quality = Quality.Maj
    var inversion: Inversion = Inversion.Root
    switch (figuredBass) {
      case "6":
        inversion = Inversion.First
        break
      case "64":
        inversion = Inversion.Second
        break
      case "7":
        inversion = Inversion.Root
        break
      case "65":
        inversion = Inversion.First
        break
      case "43":
        inversion = Inversion.Second
        break
      case "42":
        inversion = Inversion.Third
        break
    }
    switch (romanNumeral) {
      case "I":
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Maj
          : Quality.Maj7
        break
      case "ii":
        inter = interval("M2")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Min
          : Quality.Min7
        break
      case "iii":
        inter = interval("M3")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Min
          : Quality.Min7
        break
      case "IV":
        inter = interval("p4")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Maj
          : Quality.Maj7
        break
      case "V":
        inter = interval("p5")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Maj
          : Quality.Dom7
        break
      case "vi":
        inter = interval("M6")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Min
          : Quality.Min7
        break
      case "vii":
        inter = interval("M7")
        break
      case "i":
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Min
          : Quality.Min7
        break
      case "III":
        inter = interval("m3")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Maj
          : Quality.Maj7
        break
      case "iv":
        inter = interval("p4")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Min
          : Quality.Min7
        break
      case "v":
        inter = interval("p5")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Min
          : Quality.Min7
        break
      case "VI":
        inter = interval("m6")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Maj
          : Quality.Maj7
        break
      case "VII":
        inter = interval("m7")
        quality = !FiguredBass.isSeventh(figuredBass)
          ? Quality.Maj
          : Quality.Dom7
        break
      default:
        throw new Error(`Invalid roman numeral: ${string}`)
    }
    if (symbol) {
      switch (symbol) {
        case "°":
          quality = !FiguredBass.isSeventh(figuredBass)
            ? Quality.Dim
            : Quality.Full
          break
        case "ø":
          quality = Quality.Half
          break
        default:
          throw new Error(`Invalid quality symbol: ${symbol}`)
      }
    }

    return { interval: inter, quality, inversion }
  },
  toNamedChord(roman: RomanNumeral, tonic: Note): NamedChord {
    const root = Note.transpose(roman.interval, tonic)
    const chord = {
      root: root,
      quality: roman.quality,
    }
    return chord
  },
  toFullChord(roman: RomanNumeral, tonic: Note): FullChord {
    const root = Note.transpose(roman.interval, tonic)
    const chord = {
      root: root,
      quality: roman.quality,
    }
    return { chord, inversion: roman.inversion }
  },
}

export type RaisedFunction = RomanNumeral[]

export namespace RaisedFunction {
  export function toDisplayString(roman: RaisedFunction): string {
    return roman
      .map((r) => RomanNumeral.toDisplayString(r))
      .reduce((acc, curr) => acc + "/" + curr)
  }
  export function toNamedChord(roman: RaisedFunction, tonic: Note): NamedChord {
    switch (roman.length) {
      case 0:
        throw new Error("Empty roman numeral")
      case 1:
        return RomanNumeral.toNamedChord(roman[0], tonic)
      default:
        return toNamedChord(
          roman.slice(0, -1),
          Note.transpose(roman[roman.length - 1].interval, tonic)
        )
    }
  }
}

export function rn(string: string): RaisedFunction {
  return string.split("/").map((num) => {
    return RomanNumeral.fromString(num)
  })
}
