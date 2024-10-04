import { rotateBy } from "../../helpers"
import { Interval, interval } from "./Interval"
import { Note, OctavedNote } from "./MusicBasics"

type ChordTone = 1 | 3 | 5 | 7
export enum Inversion {
  Root,
  First,
  Second,
  Third,
}
export namespace Inversion {
  export function toN(inversion: Inversion): ChordTone {
    switch (inversion) {
      case Inversion.Root:
        return 1
      case Inversion.First:
        return 3
      case Inversion.Second:
        return 5
      case Inversion.Third:
        return 7
    }
  }
}

export enum Quality {
  Maj7 = "Maj7",
  Dom7 = "Dom7",
  Min7 = "Min7",
  Half = "Half-Dim7",
  Full = "Dim7",
  Maj = "Maj",
  Min = "Min",
  Dim = "Dim",
  Aug = "Aug",
}
export namespace Quality {
  export function toLeadSheet(quality: Quality): string {
    switch (quality) {
      case Quality.Maj7:
        return "△7"
      case Quality.Dom7:
        return "7"
      case Quality.Min7:
        return "m7"
      case Quality.Half:
        return "ø7"
      case Quality.Full:
        return "°7"
      case Quality.Maj:
        return ""
      case Quality.Min:
        return "m"
      case Quality.Dim:
        return "°"
      case Quality.Aug:
        return "+"
    }
  }
  export function isMajor(quality: Quality): boolean {
    return Interval.name(Quality.toIntervals(quality)[0]) === "M3"
  }
  export function isMinor(quality: Quality): boolean {
    return Interval.name(Quality.toIntervals(quality)[0]) === "m3"
  }
  export function isSeventh(quality: Quality): boolean {
    return Quality.toIntervals(quality).length === 3
  }

  export function toIntervals(quality: Quality): Interval[] {
    switch (quality) {
      case Quality.Maj7:
        return [interval("M3"), interval("m3"), interval("M3")] as Seventh
      case Quality.Dom7:
        return [interval("M3"), interval("m3"), interval("m3")] as Seventh
      case Quality.Min7:
        return [interval("m3"), interval("M3"), interval("m3")] as Seventh
      case Quality.Half:
        return [interval("m3"), interval("m3"), interval("m3")] as Seventh
      case Quality.Full:
        return [interval("m3"), interval("m3"), interval("dim3")] as Seventh
      case Quality.Maj:
        return [interval("M3"), interval("m3")] as Triad
      case Quality.Min:
        return [interval("m3"), interval("M3")] as Triad
      case Quality.Dim:
        return [interval("m3"), interval("m3")] as Triad
      case Quality.Aug:
        return [interval("M3"), interval("M3")] as Triad
    }
  }
}

export enum Mode {
  Ionian,
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  Aeloian,
  Locrian,
}

type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type Scale = Interval[]
export namespace Scale {
  export const MajorScale: Scale = [
    interval("M2"),
    interval("M2"),
    interval("m2"),
    interval("M2"),
    interval("M2"),
    interval("M2"),
    interval("m2"),
  ]

  export const HarmonicMinor: Scale = [
    interval("M2"),
    interval("m2"),
    interval("M2"),
    interval("M2"),
    interval("m2"),
    interval("aug2"),
    interval("m2"),
  ]

  export const MinorScale = mode(Mode.Aeloian)

  export function mode(mode: Mode): Scale {
    return rotateBy(mode, MajorScale)
  }

  export function toDisplayString(scale: Scale) {
    var output = ""
    scale.forEach((interval) => (output += Interval.name(interval) + " "))
    return output
  }
}

type Triad = [Interval.Third, Interval.Third]
type Shell = [Interval.Third, Interval.Fifth]
type Seventh = [Interval.Third, Interval.Third, Interval.Third]

export type ChordStructure = Triad | Seventh | Shell | Interval[]
export const ChordStructure = {
  isTriad(chord: ChordStructure): chord is Triad {
    return chord.length === 2
  },
  isSeventh(chord: ChordStructure): chord is Seventh {
    return chord.length === 3
  },
  isShell(chord: ChordStructure): chord is Shell {
    return chord.length === 2 && chord[0].n === 3 && chord[1].n === 5
  },

  toQuality(chord: ChordStructure): Quality | null {
    // If chord it's seventh chord
    if (this.isSeventh(chord)) {
      switch (Interval.name(chord[0])) {
        case "m3":
          switch (Interval.name(chord[1])) {
            case "m3":
              switch (Interval.name(chord[2])) {
                case "m3":
                  return Quality.Full
                case "M3":
                  return Quality.Half
                default:
                  return null
              }
            case "M3":
              switch (Interval.name(chord[2])) {
                case "m3":
                  return Quality.Min7
                default:
                  return null
              }
            default:
              return null
          }
        case "M3":
          switch (Interval.name(chord[1])) {
            case "m3":
              switch (Interval.name(chord[2])) {
                case "m3":
                  return Quality.Dom7
                case "M3":
                  return Quality.Maj7
                default:
                  return null
              }
            default:
              return null
          }
        default:
          return null
      }
    } else if (this.isTriad(chord)) {
      // If it's a triad
      switch (Interval.name(chord[0])) {
        case "m3":
          switch (Interval.name(chord[1])) {
            case "m3":
              return Quality.Dim
            case "M3":
              return Quality.Min
            default:
              return null
          }
        case "M3":
          switch (Interval.name(chord[1])) {
            case "m3":
              return Quality.Maj
            case "M3":
              return Quality.Aug
            default:
              return null
          }
        default:
          return null
      }
    } else return null
  },
  nextInversion(chord: ChordStructure): ChordStructure {
    const remainingIntervals = chord.slice(1, chord.length)

    const newInterval = Interval.subtract(
      Interval.invert(chord[0]),
      Interval.add(chord.slice(1, chord.length))
    )
    console.log("interval to add on top", newInterval)

    console.log({ remainingIntervals })
    return [...remainingIntervals, newInterval]
  },

  applyInversion(inversion: Inversion, chord: ChordStructure): Interval[] {
    var chordToReturn = chord

    for (let i = 0; i < inversion; i++) {
      chordToReturn = this.nextInversion(chordToReturn)
    }
    return chordToReturn
  },
}

console.log(
  "Apply inversion",
  ChordStructure.applyInversion(Inversion.Second, [
    interval("M3"),
    interval("m3"),
  ])
)

console.log(
  "TESTING shell",
  ChordStructure.isShell([interval("m3"), interval("p5")])
)

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

/** Returns all triads in a scale */
function allDiatonicTriads(scale: Scale): Triad[] {
  return scale.map((_, i) => diatonicTriad((i + 1) as ScaleDegree, scale))
}
/** Returns all seventh chords in a scale */
function allDiatonicSevenths(scale: Scale): Seventh[] {
  return scale.map((_, i) => diatonicSeventh((i + 1) as ScaleDegree, scale))
}

// console.log(
//   allDiatonicSevenths(Scale.mode(Mode.Mixolydian)).map((chord) =>
//     ChordStructure.toQuality(chord)
//   )
// )

export type NamedChord = {
  root: Note
  quality: Quality
}
export const NamedChord = {
  toLeadSheet(chord: NamedChord): string {
    return Note.toDisplayString(chord.root) + Quality.toLeadSheet(chord.quality)
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
          scale
            .slice(0, i)
            .reduce<Interval>(
              (partialSum, a) => Interval.add2(partialSum, a),
              Interval.unison
            ),
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
  // console.log(Scale.toDisplayString(intervals))
  return Interval.add(intervals)
}
//console.log(Scale.toDisplayString(Scale.MajorScale))

//console.log(Interval.name(intervalFromScaleAndDegree(Scale.MajorScale, 2)))

// console.log(
//   "HALLELUJAH ",
//   diatonicTriadsBasedOnRoot(note("C"), Scale.MajorScale).map((chord) =>
//     NamedChord.toLeadSheet(chord)
//   ),
//   "DOUBLE HALLELUJAH",
//   diatonicSeventhsBasedOnRoot(note("C"), Scale.MajorScale).map((chord) =>
//     NamedChord.toLeadSheet(chord)
//   )
// )

type Key = {
  note: Note
  scale: Scale
}
const Key = {
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
console.log(
  "TESTING SHELL",
  Scale.toDisplayString(
    rootPositionShellToSeventh([
      { n: 3, offset: 0 },
      { n: 5, offset: 0 },
    ])
  )
)
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
    console.log("inverted", Interval.invert(newIntervalList[0]))
    const newInterval = Interval.subtract(
      Interval.invert(newIntervalList[0]),
      Interval.add(newIntervalList.slice(1, newIntervalList.length))
    )
    console.log("interval to add on top", newInterval)
    const remainingIntervals = newIntervalList.slice(1, intervals.length)
    console.log({ remainingIntervals })
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

type FullChord = {
  chord: NamedChord
  inversion: Inversion
}
export namespace FullChord {
  export function toLeadSheet(fullChord: FullChord) {
    return `${NamedChord.toLeadSheet(fullChord.chord)}
      ${
        fullChord.inversion > 0
          ? `/
      ${Note.toDisplayString(FullChord.bassNote(fullChord))}`
          : ""
      }`
  }

  enum Voice {
    Bass,
    Tenor,
    Alto,
    Soprano,
  }

  export function voice(voice: Voice, { chord, inversion }: FullChord): Note {
    const root = chord.root

    const intervals = Quality.toIntervals(chord.quality)

    const invertedChord = ChordStructure.applyInversion(inversion, intervals)

    var sum: Interval[] = []
    for (let i = 0; i < inversion; i++) {
      sum.push(intervals[i])
      console.log("Is this undefined", intervals[i])
    }

    const bassNote = Note.transpose(Interval.add(sum), root)

    var intervalsToAdd = []
    for (let i = 0; i < voice; i++) {
      intervalsToAdd.push(invertedChord[i])
    }

    return Note.transpose(Interval.add(intervalsToAdd), bassNote)
  }

  export function bassNote(fullChord: FullChord): Note {
    return voice(Voice.Bass, fullChord)
  }

  // export function bassNote({ inversion, chord }: FullChord): Note {
  //   const quality = chord.quality
  //   const root = chord.root
  //   console.log({ root })
  //   console.log({ inversion })
  //   switch (inversion) {
  //     case Inversion.Root:
  //       return Note.transpose(Interval.unison, root)

  //     case Inversion.First:
  //       switch (quality) {
  //         case Quality.Maj7:
  //         case Quality.Dom7:
  //           return Note.transpose(interval("M3"), root)
  //         default:
  //           return Note.transpose(interval("m3"), root)
  //       }

  //     case Inversion.Second:
  //       switch (quality) {
  //         case Quality.Half:
  //         case Quality.Full:
  //           return Note.transpose(interval("dim5"), root)
  //         default:
  //           return Note.transpose(interval("p5"), root)
  //       }
  //     case Inversion.Third:
  //       switch (quality) {
  //         case Quality.Maj7:
  //           return Note.transpose(interval("M7"), root)
  //         case Quality.Dom7:
  //         case Quality.Min7:
  //         case Quality.Half:
  //           return Note.transpose(interval("m7"), root)
  //         default:
  //           return Note.transpose(interval("dim7"), root)
  //       }
  //   }
  // }
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
