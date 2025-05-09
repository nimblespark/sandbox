import {
  Button,
  Dialog,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
} from "@mui/material"
import { BasicPage } from "../../BasicPage"
import { NamedChord, RaisedFunction, rn } from "../../music/Music"
import { useState } from "react"
import { useViewport } from "../../../useViewport"
import { Close, Delete } from "@mui/icons-material"
import { note } from "../../music/MusicBasics"
import { Note } from "../../music/Note"
import { Accidental } from "../../music/Accidental"
import { NoteNumber } from "../../music/NoteNumber"
import { Quality } from "../../music/Quality"
import {
  findNLengthProgressionsWithEnd,
  findNLengthProgressionsWithEnd2,
  functionToNamedChord,
} from "../../music/Progression"
import { Scale } from "../../music/Scale"
import { allCombinations } from "../../music/Harmony"
import { AlphaTabPlayground } from "../../music/AlphaTabPlayground"

const notes: Note[] = [
  note("C"),
  note("D", Accidental.Flat),
  note("D"),
  note("E", Accidental.Flat),
  note("E"),
  note("F"),
  note("G", Accidental.Flat),
  note("G"),
  note("A", Accidental.Flat),
  note("A"),
  note("B", Accidental.Flat),
  note("B"),
]

const qualities: Quality[] = [
  Quality.Maj7,
  Quality.Dom7,
  Quality.Min7,
  Quality.Half,
  Quality.Full,
  Quality.Maj,
  Quality.Min,
]

export function ProgressionPage() {
  const [root, setRoot] = useState<NoteNumber>(0)
  const [quality, setQuality] = useState<Quality>(Quality.Maj7)
  const [chords, setChords] = useState<NamedChord[]>([])
  const [numerals, setNumerals] = useState<RaisedFunction[]>([])
  const [alphaDialogOpen, setAlphaDialogOpen] = useState<boolean>(false)

  const [length, setLength] = useState<number>(4)

  const { isMobile } = useViewport()

  function handleRandom() {
    const progressions = findNLengthProgressionsWithEnd2(length, "i", "I")
    const progression =
      progressions[Math.floor(Math.random() * progressions.length)]
    //progression.pop()
    setChords(
      progression.map((chord) =>
        functionToNamedChord(note("C"), chord, { allSevenths: true })
      )
    )
    setNumerals(progression.map((chord) => rn(chord)))
  }
  return (
    <BasicPage title="Progression">
      <div
        style={{
          padding: "30px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <RadioGroup
          row
          value={root}
          onChange={(_, value) => setRoot(parseInt(value) as NoteNumber)}
        >
          {notes.map((note) => (
            <FormControlLabel
              value={Note.toNoteNumber(note)}
              control={<Radio />}
              label={Note.toDisplayString(note)}
            />
          ))}
        </RadioGroup>
        <RadioGroup
          row
          value={quality}
          onChange={(_, value) => setQuality(value as Quality)}
        >
          {qualities.map((q) => (
            <FormControlLabel value={q} control={<Radio />} label={q} />
          ))}
        </RadioGroup>
        <Button
          onClick={() =>
            setChords([
              ...chords,
              { root: NoteNumber.toNote(root), quality: quality },
            ])
          }
        >
          Add Chord
        </Button>
        {chords.map((chord) => (
          <div
            style={{ backgroundColor: "greenyellow", width: 100, height: 30 }}
          >
            {NamedChord.toLeadSheet(chord)}
          </div>
        ))}
        <Button onClick={() => setAlphaDialogOpen(true)}>Play</Button>
        <IconButton onClick={() => setChords([])}>
          <Delete />
        </IconButton>
        <Button onClick={handleRandom}>Random</Button>
        <div style={{ height: 40 }}></div>
        <Slider
          min={1}
          max={8}
          valueLabelDisplay="on"
          value={length}
          onChange={(_, value) => setLength(value as number)}
        >
          Length
        </Slider>

        <Button onClick={() => console.log(allCombinations([1, 2, 3]))}>
          Generate possibilities
        </Button>
      </div>

      {alphaDialogOpen && (
        <Dialog
          maxWidth="lg"
          fullScreen={isMobile}
          open={alphaDialogOpen}
          onClose={() => setAlphaDialogOpen(false)}
        >
          {/* <DialogTitle>{`${Note.toDisplayString(chord.note)} ${
          chord.quality ? chord.quality : ""
        } ${chord.inversion ? chord.inversion : ""} ${
          chord.string ? ` on ${chord.string} string` : ""
        }`}</DialogTitle> */}
          <IconButton
            onClick={() => setAlphaDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 9,
              top: 9,
              color: (theme) => theme.palette.grey[600],
            }}
          >
            <Close />
          </IconButton>
          <AlphaTabPlayground chords={chords} numerals={numerals} />
        </Dialog>
      )}
    </BasicPage>
  )
}
