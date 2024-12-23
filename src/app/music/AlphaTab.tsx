import { useEffect, useRef } from "react"
import "../AlphaTab.css"
import { AlphaTabApi, Settings } from "@coderline/alphatab"
import { BasicPage } from "../BasicPage"
import { Button, Select, Slider } from "@mui/material"
import {
  diatonicSeventhsBasedOnRoot,
  diatonicTriadsBasedOnRoot,
  NamedChord,
} from "../music/Music"
import { GuitarChord, GuitarMusic, String } from "../music/Guitar"
import { note } from "../music/MusicBasics"
import { Inversion } from "../music/Inversion"
import { Mode, Scale } from "../music/Scale"

type Props = {
  chords: NamedChord[]
}

export function AlphaTab(props: Props) {
  const elementRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<AlphaTabApi | null>(null)

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
          // file: "https://www.alphatab.net/files/canon.gp",
          fontDirectory: "./font/",
        },
        player: {
          enablePlayer: true,
          enableCursor: true,
          enableUserInteraction: true,
          soundFont: "./soundfont/sonivox.sf2",
        },
      } as Settings)

      // `
      //   \\title "Hello alphaTab"
      //   .
      //   :4 0.6 1.6 3.6 0.5 | 2.5 3.5 0.4 2.4 |
      //       3.4 0.3 2.3 0.2 | 1.2 3.2 0.1 1.1 |
      //       3.1.1
      // `

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

      const guitarMusic = {
        key: { note: note("C") },
        chords: newChords,
      }

      const tex = `
      \\tempo 120
      
      . 


      ${GuitarMusic.toTex(guitarMusic)}`

      console.log(tex)

      apiRef.current.metronomeVolume = 1.0
      apiRef.current.isLooping = true
      apiRef.current.playbackSpeed = 1.0

      apiRef.current.countInVolume = 1.0

      apiRef.current.tex(tex)

      // setApi(api)
    }
    return () => {
      //console.log("destroy", elementRef, apiRef.current)
      apiRef.current?.destroy()
    }
  }, [])

  function playPause() {
    apiRef.current?.playPause()
  }

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
      </div>
      <Button onClick={playPause}>Play/Pause</Button>
    </>
  )
}
