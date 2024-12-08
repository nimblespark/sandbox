import { Button } from "@mui/material"
import { useState } from "react"
import SheetMusic from "react-sheet-music"
import { SplendidGrandPiano } from "smplr"
import { OctavedNote } from "../../music/OctavedNote"

const context = new AudioContext()
const piano = new SplendidGrandPiano(context)

export function SheetMusicPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <>
      <SheetMusic
        // Textual representation of music in ABC notation
        // The string below will show four crotchets in one bar
        onEvent={(event: any) => {
          console.log(event)
          piano.stop()
          if (!event) {
            return
          }
          OctavedNote.fromManyABC(event.note).forEach((note) =>
            piano.start(OctavedNote.toMidiNumber(note))
          )
        }}
        isPlaying={isPlaying}
        notation="|[FAce]| A| B"
        bpm={70}
      />
      <Button onClick={() => setIsPlaying(!isPlaying)}>Play/Pause</Button>
    </>
  )
}
