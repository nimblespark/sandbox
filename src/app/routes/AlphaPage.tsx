import { useEffect, useRef } from "react"
import "../AlphaTab.css"
import { AlphaTabApi, Settings } from "@coderline/alphatab"

enum Note {
  C = "C",
  Db = "D♭",
  D = "D",
  Eb = "E♭",
  E = "E",
  F = "F",
  Gb = "G♭",
  G = "G",
  Ab = "A♭",
  A = "A",
  Bb = "B♭",
  B = "B",
}

enum Accidental {
  Natural = 0,
  Sharp = 1,
  Flat = -1,
  DoubleSharp = 2,
  DoubleFlat = 2,
}

enum Inversion {
  root = "Root",
  first = "1st",
  second = "2nd",
  third = "3rd",
}

enum Quality {
  maj7 = "Maj7",
  dom7 = "Dom7",
  min7 = "Min7",
  half = "Half-Dim7",
  full = "Dim7",
}

enum String {
  fifth = "fifth",
  sixth = "sixth",
}

enum Mode {
  Ionian = 1,
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  Aeloian,
  Locrian,
}

type Props = {
  // onPlayPause: () => void
  // elementRef: React.RefObject<HTMLDivElement>
}

type Triad = {
  1: Note
  2: Note
  3: Note
}

type Seventh = {
  1: Note
  2: Note
  3: Note
  4: Note
}

type GuitarNote = {
  string: number
  fret: number
}

type GuitarChord = GuitarNote[]

type Chord = Note[]

type GuitarMusic = {
  key: { note: Note; mode: Mode }
  chord: GuitarChord
}

function GuitarMusicToTex(music: GuitarMusic) {
  return `\\ks ${music.key.note}. `
}

export function AlphaTab(props: Props) {
  const elementRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<AlphaTabApi | null>(null)

  useEffect(() => {
    console.log("USE EFFECT", elementRef.current)
    if (elementRef.current) {
      apiRef.current = new AlphaTabApi(elementRef.current, {
        core: {
          // file: "https://www.alphatab.net/files/canon.gp",
          fontDirectory: "/font/",
        },
        player: {
          enablePlayer: true,
          enableCursor: true,
          enableUserInteraction: true,
          soundFont: "/soundfont/sonivox.sf2",
        },
      } as Settings)

      console.log("SETTING TEX", apiRef.current)
      apiRef.current.tex(`
        \\title "Hello alphaTab"
        .
        :4 0.6 1.6 3.6 0.5 | 2.5 3.5 0.4 2.4 |
            3.4 0.3 2.3 0.2 | 1.2 3.2 0.1 1.1 |
            3.1.1
      `)

      // setApi(api)
    }
    return () => {
      console.log("destroy", elementRef, apiRef.current)
      apiRef.current?.destroy()
    }
  }, [])

  function playPause() {
    apiRef.current?.playPause()
  }

  function texKey(note: Note) {
    note
  }
  return (
    <>
      Hello AlphaTab!
      <button onClick={playPause}>Play/Pause</button>
      <div ref={elementRef}></div>
    </>
  )
}
