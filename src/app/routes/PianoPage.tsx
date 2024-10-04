import { Piano, KeyboardShortcuts } from "../../my-react-piano"
import "react-piano/dist/styles.css"
import "./music/customPianoStyles.css"
import { SplendidGrandPiano } from "smplr"
import {
  diatonicNotesBasedOnRoot,
  FullChord,
  fullChordAndKeyToRomanNumeral,
  octavedNotesToChord,
  RomanNumeral,
  Scale,
} from "./music/Music"
import { useEffect, useState } from "react"
import { Button, MenuItem, Select } from "@mui/material"
import { Note, NoteNumber, OctavedNote } from "./music/MusicBasics"
import { RomanNumeralComponent } from "./music/RomanNumeralComponent"

const context = new AudioContext()
const piano = new SplendidGrandPiano(context)
//piano.output.addEffect("reverb", new Reverb(context), 0.2)

export function PianoPage() {
  const firstNote = 48
  const lastNote = 72
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  })

  // useEffect(() => {
  //   console.log("Remounted")
  // }, [])

  const availableScales = [
    { name: "Major Scale", scale: Scale.MajorScale },
    { name: "Harmonic Minor Scale", scale: Scale.HarmonicMinor },
    { name: "Minor scale", scale: Scale.MinorScale },
  ]

  const [root, setRoot] = useState<Note | null>(null)
  const [scale, setScale] = useState<Scale | null>(null)
  const [activeMidiNotes, setActiveMidiNotes] = useState<number[]>([])

  const sortedOctavedNotes = activeMidiNotes.sort()

  const flatNotes = sortedOctavedNotes.map(OctavedNote.fromMidiNumber)

  const sharpNotes = sortedOctavedNotes.map(OctavedNote.fromMidiNumberSharp)

  const flatChord = octavedNotesToChord(flatNotes)

  const sharpChord = octavedNotesToChord(sharpNotes)

  const finalChord = flatChord ? flatChord : sharpChord

  const chordName = finalChord && FullChord.toLeadSheet(finalChord)

  const romanNumeral =
    (finalChord &&
      root &&
      scale &&
      RomanNumeral.toDisplayString(
        fullChordAndKeyToRomanNumeral(finalChord, { note: root, scale: scale })
      )) ??
    ""

  // const bassNote =
  //   currentOctavedNotes.length > 0 ? currentOctavedNotes[0] : null

  // var simplifiedOctavedNotes: OctavedNote[] = bassNote ? [bassNote] : []

  // currentOctavedNotes.forEach((potential) => {
  //   // if this is a unique note, add it to the simplified list in it's lowest position that's still above the bass
  //   if (
  //     !simplifiedOctavedNotes.some(
  //       (element) =>
  //         Note.toNoteNumber(element.note) === Note.toNoteNumber(potential.note)
  //     )
  //   ) {
  //     var noteToAdd = potential
  //     while (
  //       bassNote &&
  //       OctavedNote.toMidiNumber(potential) >
  //         OctavedNote.toMidiNumber(bassNote) + 11
  //     ) {
  //       noteToAdd.octave--
  //     }
  //     simplifiedOctavedNotes.push(noteToAdd)
  //     console.log({ simplifiedOctavedNotes })
  //   }
  // })

  // simplifiedOctavedNotes.sort(
  //   (a, b) => OctavedNote.toMidiNumber(a) - OctavedNote.toMidiNumber(b)
  // )

  // console.log("Finished notes", simplifiedOctavedNotes)

  // const currentChordAndRoot = convertIntervalsToThirds(
  //   intervalsFromNotes(simplifiedOctavedNotes)
  // )
  // const chordQuality =
  //   currentChordAndRoot &&
  //   ChordStructure.toQuality(currentChordAndRoot.intervals)
  // const chordName = chordQuality
  //   ? `${NamedChord.toLeadSheet({
  //       root: simplifiedOctavedNotes[currentChordAndRoot.rootNum].note,
  //       quality: chordQuality,
  //     })} ${
  //       bassNote &&
  //       bassNote.note !== currentOctavedNotes[currentChordAndRoot.rootNum].note
  //         ? ` / ${Note.toDisplayString(bassNote.note)}`
  //         : ""
  //     }`
  //   : ""

  // console.log({ currentOctavedNotes })
  // console.log({ currentChordAndRoot })
  // console.log({ chordQuality })
  // console.log({ chordName })

  const diatonicNotes =
    root &&
    scale &&
    diatonicNotesBasedOnRoot(root, scale).flatMap((note) =>
      Note.toMidiNumbersForAllOctaves(note)
    )

  function handleInputMessage(event: MIDIMessageEvent) {
    // console.log("Midi input")
    if (event.data) {
      const note = event.data[1]
      const velocity = event.data[2]
      // console.log(note, velocity)
      if (velocity === 0) {
        setActiveMidiNotes((currentNotes) =>
          currentNotes.filter((activeNote) => activeNote !== note)
        )
      } else {
        setActiveMidiNotes((currentNotes) => [
          ...new Set([...currentNotes, note]),
        ])
      }
    }
  }
  //console.log({ activeMidiNotes })

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const data = await navigator.requestMIDIAccess()
      // console.log("inputs size", data.inputs.size)
      const keys = data.inputs
      keys.forEach((input) => {
        // console.log("INPUT", input)
        input.onmidimessage = handleInputMessage
      })

      //console.log("MIDI inputs", data.inputs.entries())
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [])

  return (
    <>
      <div>
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber: number) => {
            piano.start(midiNumber)
            setActiveMidiNotes((currentNotes) => [
              ...new Set([...currentNotes, midiNumber]),
            ])
            if (!root)
              setRoot(NoteNumber.toNote((midiNumber % 12) as NoteNumber))
          }}
          stopNote={(midiNumber: number) => {
            piano.stop(midiNumber)
            setActiveMidiNotes((currentNotes) =>
              currentNotes.filter((activeNote) => activeNote !== midiNumber)
            )
          }}
          width={1000}
          highlightedNotes={
            diatonicNotes
              ? diatonicNotes
              : root
              ? Note.toMidiNumbersForAllOctaves(root)
              : []
          }
          activeNotes={activeMidiNotes}
          keyboardShortcuts={keyboardShortcuts}
        />
      </div>
      {!root && <div>Choose a root note by playing a note on the piano</div>}
      {root && !scale && (
        <div>
          <div>Now select a scale!</div>
          <Select
            value={""}
            onChange={(event) =>
              setScale(
                availableScales[event.target.value as unknown as number].scale
              )
            }
          >
            {availableScales.map((scale, i) => {
              return <MenuItem value={i}>{scale.name}</MenuItem>
            })}
          </Select>
        </div>
      )}
      {root && scale && (
        <Button
          onClick={() => {
            setRoot(null)
            setScale(null)
          }}
        >
          Restart
        </Button>
      )}
      <div style={{ fontSize: 200 }}>{chordName}</div>
      <RomanNumeralComponent romanNumeral={romanNumeral} />
    </>
  )
}
