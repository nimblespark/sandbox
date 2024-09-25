import { Piano, KeyboardShortcuts, MidiNumbers } from "../../my-react-piano"
import "react-piano/dist/styles.css"
import "./music/customPianoStyles.css"
import { SplendidGrandPiano, Reverb } from "smplr"
import {
  Accidental,
  diatonicNotesBasedOnRoot,
  Note,
  note,
  NoteNumber,
  Scale,
} from "./music/Music"
import { useEffect, useState } from "react"
import { Button, MenuItem, Select } from "@mui/material"

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

  const diatonicNotes =
    root &&
    scale &&
    diatonicNotesBasedOnRoot(root, scale).flatMap((note) =>
      Note.toMidiNumbersForAllOctaves(note)
    )

  function handleInputMessage(event: MIDIMessageEvent) {
    if (event.data) {
      const note = event.data[1]
      const velocity = event.data[2]
      console.log(note, velocity)
      if (velocity === 0) {
        setActiveMidiNotes((currentNotes) =>
          currentNotes.filter((activeNote) => activeNote !== note)
        )
      } else {
        setActiveMidiNotes((currentNotes) => [...currentNotes, note])
      }
    }
  }
  console.log({ activeMidiNotes })

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const data = await navigator.requestMIDIAccess()
      const keys = data.inputs
      keys.forEach((input) => {
        console.log("INPUT", input)
        input.onmidimessage = handleInputMessage
      })

      console.log("MIDI inputs", data.inputs.entries())
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
            if (!root)
              setRoot(NoteNumber.toNote((midiNumber % 12) as NoteNumber))
          }}
          stopNote={(midiNumber: number) => {
            piano.stop(midiNumber)
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
    </>
  )
}
