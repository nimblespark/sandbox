import { useEffect, useRef, useState } from "react"
import "../AlphaTab.css"
import { AlphaTabApi, Settings } from "@coderline/alphatab"
import { Button, Select, Slider } from "@mui/material"
import { GuitarChord, GuitarMusic } from "./Guitar"
import { Inversion } from "./Inversion"
import { NamedChord, diatonicSeventhsBasedOnRoot } from "./Music"
import { note, oNote } from "./MusicBasics"
import { Mode, Scale } from "./Scale"
import { OctavedNote } from "./OctavedNote"
import { Harmony, OctavedHarmony, OctavedHarmonyProgression } from "./Harmony"
import SheetMusic from "react-sheet-music"
import { Soundfont, SplendidGrandPiano } from "smplr"

const context = new AudioContext()
const choir = new Soundfont(context, { instrument: "choir_aahs" })

type Props = {
  chords: NamedChord[]
}

export function AlphaTabPlayground(props: Props) {
  const elementRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<AlphaTabApi | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const [harmony, setHarmony] = useState(
    Harmony.harmoniesFromNamedChords(props.chords)
  )

  const { bass, tenor, alto, soprano } =
    OctavedHarmonyProgression.individualParts(harmony)

  const abc = `
  K:C
    %%score V1 V2 VA CL
    V:S clef=treble name="Soprano"
    V:A clef=treble name="Alto"
    V:T clef=bass name="Tenor"
    V:B clef=bass name="Bass"
  [V:S]     ${soprano.map(OctavedNote.toABC).join("")}
  [V:A]     ${alto.map(OctavedNote.toABC).join("")}
  [V:T]     ${tenor.map(OctavedNote.toABC).join("")}
  [V:B]     ${bass.map(OctavedNote.toABC).join("")}`

  // const string = props.string ?? undefined

  // const guitarMusic: GuitarMusic = {
  //   key: { note: note("C") },
  //   chords: GuitarChord.generate(
  //     props.note,
  //     props.quality,
  //     string,
  //     props.inversion
  //   ),
  // }

  useEffect(() => {
    if (elementRef.current) {
      apiRef.current = new AlphaTabApi(elementRef.current, {
        core: {
          fontDirectory: "./font/",
          includeNoteBounds: true,
        },
        player: {
          enablePlayer: true,
          enableCursor: true,
          enableUserInteraction: true,
          soundFont: "./soundfont/sonivox.sf2",
        },
      } as Settings)

      let currentLowest = 0

      const chords = diatonicSeventhsBasedOnRoot(
        note("G"),
        Scale.mode(Mode.Dorian)
      )
        .concat(
          diatonicSeventhsBasedOnRoot(note("G"), Scale.mode(Mode.Dorian))[0]
        )
        .map((chord) => {
          // return GuitarChord.generate(
          //   chord.root,
          //   chord.quality,
          //   6,
          //   Inversion.Root
          // )[0]
          const chosenChord = GuitarChord.generate(
            chord.root,
            chord.quality,
            6,
            Inversion.Root
          ).find((chord) => chord.notes[0].fret > currentLowest)
          // console.log({ chosenChord })
          currentLowest = chosenChord?.notes[0].fret ?? 0
          return chosenChord!
        })

      const coolMusic = {
        key: { note: note("C") },
        chords: chords,
      }

      const newChords = props.chords.map(
        (chord) =>
          GuitarChord.generate(chord.root, chord.quality, 6, Inversion.Root)[0]
      )

      console.log(
        "Bounds: ",
        apiRef.current.renderer.boundsLookup?.findMasterBarByIndex(0)
      )

      const guitarMusic = {
        key: { note: note("C") },
        chords: newChords,
      }

      const tex = `

      
      \\track "Piano with Grand Staff" "pno."
    \\staff{score} \\tuning piano \\instrument 52 \\tempo 60
    
    ${OctavedHarmonyProgression.toTex(harmony)} 
    
    `

      console.log(tex)

      //apiRef.current.metronomeVolume = 1.0
      apiRef.current.isLooping = true
      apiRef.current.playbackSpeed = 1.0

      //apiRef.current.countInVolume = 1.0

      apiRef.current.tex(tex)

      console.log("api", apiRef.current)

      // setApi(api)
    }
    return () => {
      //console.log("destroy", elementRef, apiRef.current)
      apiRef.current?.destroy()
    }
  }, [harmony])

  function playPause() {
    apiRef.current?.playPause()
  }

  console.log({ abc })

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", overflow: "auto" }}
      >
        <div style={{ width: 800, overflow: "auto" }} ref={elementRef} />
      </div>
      <div style={{ display: "flex" }}>
        <Slider
          defaultValue={1}
          step={0.1}
          min={0.1}
          max={2.0}
          style={{ margin: "50px", flex: 1 }}
          onChangeCommitted={(_, value) => {
            if (apiRef.current) apiRef.current.playbackSpeed = value as number
          }}
        >
          Tempo
        </Slider>
        <SheetMusic
          onEvent={(event: any) => {
            console.log(event)
            choir.stop()
            if (!event) {
              return
            }
            OctavedNote.fromManyABC(event.note).forEach((note) =>
              choir.start(OctavedNote.toMidiNumber(note))
            )
          }}
          onBeat={(event: any) => console.log("beat", event)}
          isPlaying={isPlaying}
          notation={abc}
          bpm={30}
        />
      </div>
      <Button
        onClick={() => {
          apiRef.current?.playPause()
          //   setIsPlaying(!isPlaying)
        }}
      >
        Play/Pause
      </Button>
      <Button
        onClick={() =>
          setHarmony(Harmony.harmoniesFromNamedChords(props.chords))
        }
      >
        Regenerate
      </Button>
    </>
  )
}
