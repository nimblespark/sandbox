import "react-piano/dist/styles.css"
import "../../music/customPianoStyles.css"
import { SplendidGrandPiano } from "smplr"
import { Check, Close } from "@mui/icons-material"
import { Select, MenuItem, Button } from "@mui/material"
import { useState, useEffect } from "react"
import Xarrow from "react-xarrows"
import { KeyboardShortcuts, Piano } from "../../../my-react-piano"
import { FullChord } from "../../music/FullChord"
import { Interval } from "../../music/Interval"
import {
  octavedNotesToChord,
  RomanNumeral,
  fullChordAndKeyToRomanNumeral,
  diatonicNotesBasedOnRoot,
} from "../../music/Music"
import { note } from "../../music/MusicBasics"
import { Note } from "../../music/Note"
import { NoteNumber } from "../../music/NoteNumber"
import { OctavedNote } from "../../music/OctavedNote"
import { findNLengthProgressionsWithEnd } from "../../music/Progression"
import { RomanNumeralComponent } from "../../music/RomanNumeralComponent"
import { Scale } from "../../music/Scale"

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
  const [startNote, setStartNote] = useState<number | null>(null)
  const [endNote, setEndNote] = useState<number | null>(null)
  const [step, setStep] = useState<number>(1)
  const [highlightedNotes, setHighlightedNotes] = useState<number[]>([])
  const [randomNote, setRandomNote] = useState<Note>(note("C"))
  const [randomInterval, setRandomInterval] = useState<Interval>(
    Interval.unison
  )
  const [correctCount, setCorrectCount] = useState(0)
  const [count, setCount] = useState(0)

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

  const interval =
    (startNote &&
      endNote &&
      OctavedNote.interval(
        OctavedNote.fromMidiNumber(startNote),
        OctavedNote.fromMidiNumber(endNote)
      )) ??
    null
  console.log({ interval })

  const correctNote: boolean = startNote
    ? Note.toNoteNumber(randomNote) ===
      Note.toNoteNumber(Note.fromMidiNumber(startNote))
    : false

  const correctInterval: boolean = interval
    ? Interval.halfSteps(interval) === Interval.halfSteps(randomInterval)
    : false

  console.log("random halfsteps", Interval.halfSteps(randomInterval))
  interval && console.log("user halfsteps", Interval.halfSteps(interval))

  useEffect(() => {
    switch (step) {
      case 1:
        setRandomNote(Note.random())
        setRandomInterval(Interval.random()) //Interval.random())
        setHighlightedNotes([])
        setStartNote(null)
        setEndNote(null)
        break
      case 3:
        if (correctNote && correctInterval) setCorrectCount(correctCount + 1)
        setCount(count + 1)
    }
  }, [step])

  console.log({ randomNote })
  console.log({ randomInterval })

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
      <div style={{ width: "100%", height: "250px" }}>
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber: number) => {
            piano.start(midiNumber)
            setActiveMidiNotes((currentNotes) => [
              ...new Set([...currentNotes, midiNumber]),
            ])

            switch (step) {
              case 1:
                setStartNote(midiNumber)
                setStep(2)
                setHighlightedNotes([...highlightedNotes, midiNumber])
                break
              case 2:
                setEndNote(midiNumber)
                setStep(3)
                setHighlightedNotes([...highlightedNotes, midiNumber])
                break
              default:
                if (!root) {
                  setRoot(NoteNumber.toNote((midiNumber % 12) as NoteNumber))
                }
            }
          }}
          stopNote={(midiNumber: number) => {
            piano.stop(midiNumber)
            setActiveMidiNotes((currentNotes) =>
              currentNotes.filter((activeNote) => activeNote !== midiNumber)
            )
          }}
          highlightedNotes={
            highlightedNotes
            // diatonicNotes
            //   ? diatonicNotes
            //   : root
            //   ? Note.toMidiNumbersForAllOctaves(root)
            //   : []
          }
          activeNotes={activeMidiNotes}
          keyboardShortcuts={keyboardShortcuts}
          onHover={(midiNumber: number) => {
            if (step === 1) {
              setStartNote(midiNumber)
            } else if (step === 2) {
              setEndNote(midiNumber)
            }
          }}
        />
      </div>
      {/* {!root && <div>Choose a root note by playing a note on the piano</div>} */}
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
      <Xarrow
        start={`${startNote}`} // The ID of the start element
        end={endNote ? `${endNote}` : `${startNote}`} // The ID of the end element
        color="red" // Optional: Customize the arrow color
        headSize={8} // Optional: Customize the arrow head size
        zIndex={1000}
        startAnchor={{ position: "bottom", offset: { x: 0, y: -30 } }}
        endAnchor={{ position: "bottom", offset: { x: 0, y: -30 } }}
        path="straight"
        passProps={{ pointerEvents: "none" }}
      />

      {/* {interval && (
        <div style={{ fontSize: 40 }}>{Interval.name(interval)}</div>
      )} */}
      <div style={{ fontSize: 30 }}>
        Find the interval of a {Interval.name(randomInterval)} starting on{" "}
        {Note.toDisplayString(randomNote)}
      </div>
      {step === 3 ? (
        <div>
          <Button
            onClick={() => {
              setStep(1)
            }}
          >
            Next
          </Button>
          {correctNote && correctInterval ? (
            <Check
              style={{ color: "green", transform: "scale(2)", margin: 50 }}
            />
          ) : (
            <Close
              style={{ color: "red", transform: "scale(2)", margin: 50 }}
            />
          )}
        </div>
      ) : (
        <div style={{ margin: 40 }}></div>
      )}
      <div
        style={{ padding: 5, fontSize: 30 }}
      >{`${correctCount} / ${count}`}</div>
      <Button
        onClick={() => console.log(findNLengthProgressionsWithEnd(5, 1, 1))}
      >
        calculate n length path
      </Button>
    </>
  )
}
