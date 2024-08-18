import { useEffect, useRef } from "react"
import "../AlphaTab.css"
import { AlphaTabApi, Settings } from "@coderline/alphatab"
import { BasicPage } from "../BasicPage"
import { Button, Select } from "@mui/material"
import {
  GuitarChord,
  GuitarMusic,
  Inversion,
  Note,
  note,
  Quality,
  String,
} from "./Music"

type Props = {
  note: Note
  inversion: Inversion
  string: String | null
  quality: Quality
}

export function AlphaTab(props: Props) {
  const elementRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<AlphaTabApi | null>(null)

  const string = props.string ?? undefined

  const guitarMusic: GuitarMusic = {
    key: { note: note("C") },
    chords: GuitarChord.generate(
      props.note,
      props.quality,
      string,
      props.inversion
    ),
  }

  useEffect(() => {
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

      // `
      //   \\title "Hello alphaTab"
      //   .
      //   :4 0.6 1.6 3.6 0.5 | 2.5 3.5 0.4 2.4 |
      //       3.4 0.3 2.3 0.2 | 1.2 3.2 0.1 1.1 |
      //       3.1.1
      // `
      console.log(GuitarMusic.toTex(guitarMusic))

      apiRef.current.tex(`\\tempo 60 .  ${GuitarMusic.toTex(guitarMusic)}`)

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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ width: 600 }} ref={elementRef} />
      <Button onClick={playPause}>Play/Pause</Button>
    </div>
  )
}
