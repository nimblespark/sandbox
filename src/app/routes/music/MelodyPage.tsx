import { useEffect, useState } from "react"
import { OctavedNote } from "../../music/OctavedNote"
import { Alpha } from "../../music/Alpha"
import { note, oNote } from "../../music/MusicBasics"

import { Note } from "../../music/Note"

import { XMLParser } from "fast-xml-parser"
import { findProgresionForMelody } from "../../music/Progression"
import { Scale } from "../../music/Scale"
import {
  Harmony,
  NamedOctavedHarmonyProgression,
  OctavedHarmonyProgression,
} from "../../music/Harmony"
import { Button } from "@mui/material"
import { NamedChord } from "../../music/Music"

interface SimpleNote {
  step: string
  octave: number
}

const key = { note: note("C"), scale: Scale.MajorScale }
export function MelodyPage() {
  const [melody, setMelody] = useState<OctavedNote[]>([
    oNote("C", 4),
    oNote("D", 4),
    oNote("E", 4),
    oNote("F", 4),
  ])
  const [beat, setBeat] = useState<number>(0)

  console.log("Melody:", melody)

  // function handleKeyDown(e: { keyCode: number }) {
  //   //console.log(e.keyCode)
  //   switch (e.keyCode) {
  //     case 39:
  //       setBeat((b) => (b + 1 < melody.length ? b + 1 : b))
  //       break
  //     case 37:
  //       setBeat((b) => (b - 1 > 0 ? b - 1 : b))
  //       break
  //     case 38: {
  //       const newMelody: OctavedNote[] = [...melody]
  //       console.log("beat", beat)
  //       newMelody[beat] = {
  //         octave: newMelody[beat].octave,
  //         note: Note.transpose(interval("M2"), newMelody[beat].note),
  //       }
  //       setMelody(newMelody)
  //     }
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyDown)

  //   // Don't forget to clean up
  //   return function cleanup() {
  //     document.removeEventListener("keydown", handleKeyDown)
  //   }
  // }, [])

  const [notes, setNotes] = useState<OctavedNote[] | null>(null)
  const [harmony, setHarmony] = useState<OctavedHarmonyProgression | null>(null)
  const [progression, setProgression] = useState<NamedChord[] | null>(null)
  const [progressions, setProgressions] = useState<NamedChord[][] | null>(null)

  const tex = notes && notes.map(OctavedNote.toTex).join(" ")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async () => {
        if (reader.result) {
          const xmlData = reader.result.toString()
          const parsedNotes = await getNotes(xmlData)
          setNotes(parsedNotes)
        }
      }
      reader.readAsText(file)
    }
  }

  const getNotes = async (xmlData: string) => {
    // const response = await fetch("your-xml-endpoint")
    // const xmlText = await response.text()

    const parser = new XMLParser()
    const jsonObj = parser.parse(xmlData)

    const notes: OctavedNote[] = []

    console.log(jsonObj)

    console.log(jsonObj["score-partwise"]["part"]["measure"])
    jsonObj["score-partwise"]["part"]["measure"].forEach((measure: any) => {
      if (Array.isArray(measure["note"])) {
        measure["note"].forEach((note: any) => {
          if (note["pitch"]) {
            notes.push({
              note: { letter: note["pitch"]["step"], accidental: 0 },
              octave: parseInt(note["pitch"]["octave"]),
            })
          }
        })
      }
    })

    return notes
  }

  useEffect(() => {
    setProgressions(notes && findProgresionForMelody(notes, key))
  }, [notes, key])

  // useEffect(() => {
  //   setProgression(
  //     progressions &&
  //       progressions[Math.floor(Math.random() * progressions.length)]
  //   )
  //   setHarmony(
  //     progression &&
  //       notes &&
  //       Harmony.harmoniesFromNamedChords(progression, notes)
  //   )
  // }, [progressions, notes])

  // useEffect(() => {
  //   regenerateHarmony()
  // }, [progression])

  function regenerateProgression() {
    setProgression(
      progressions &&
        progressions[Math.floor(Math.random() * progressions.length)]
    )
  }

  function regenerateHarmony() {
    setHarmony(
      progression &&
        notes &&
        Harmony.harmoniesFromNamedChords(progression, notes)
    )
  }

  const tex2 =
    progression &&
    harmony &&
    NamedOctavedHarmonyProgression.toTex({
      progression: harmony,
      chordNames: progression,
    })

  console.log(tex2)

  return (
    <div>
      <div>
        <input type="file" accept=".xml" onChange={handleFileUpload} />
        {notes && (
          <ul>
            {notes.map((note, index) => (
              <li key={index}>{`Note ${index + 1}: ${Note.toDisplayString(
                note.note
              )} in octave ${note.octave}`}</li>
            ))}
          </ul>
        )}
      </div>
      {/* Display the parsed XML data */}
      <div>{tex && <Alpha tex={tex} beat={undefined} />}</div>
      {tex2 && <Alpha tex={tex2} />}

      {progression?.map(NamedChord.toLeadSheet).join(" ")}
      {<Button onClick={regenerateHarmony}>Regenerate</Button>}
      {<Button onClick={regenerateProgression}>New Progresion</Button>}
    </div>
  )
}
