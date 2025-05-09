import { AlphaTabApi, model, Settings } from "@coderline/alphatab"
import { Button } from "@mui/material"
import { useEffect, useRef } from "react"
import { Voice } from "./Voice"
import { Score } from "./alphaTab.d"

type Props = {
  tex: string
  par5?: Voice[]
  par8?: Voice[]
  beat?: number
  highlight?: Voice[][]
  color?: string
  name?: string
}

export function Alpha(props: Props) {
  const apiRef = useRef<AlphaTabApi | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const color = props.color || "#ff0000"
  console.log(props.name)
  const tex = `

  
  \\track "Piano with Grand Staff" "pno."
\\staff{score} \\tuning piano \\instrument 40 \\tempo 60 


${props.tex} 

`
  console.log(tex)

  function applyColors(score: Score) {
    console.log("Applying colors")
    score.tracks[0].staves[0].bars[0].voices[0].beats.forEach((beat, b) => {
      beat.notes.forEach((note, n) => {
        if (props.highlight?.[b]?.includes(n)) {
          note.style = new model.NoteStyle()
          note.style?.colors.set(
            model.NoteSubElement.StandardNotationNoteHead,
            model.Color.fromJson(color)
          )
        }
        // if (props.par5?.includes(i)) {
        //   note.style?.colors.set(
        //     model.NoteSubElement.StandardNotationNoteHead,
        //     model.Color.fromJson("#ff0000")
        //   )
        // }
        // if (props.par8?.includes(i)) {
        //   note.style?.colors.set(
        //     model.NoteSubElement.StandardNotationNoteHead,
        //     model.Color.fromJson("#00ff00")
        //   )
        // }
      })
    })
  }
  useEffect(() => {
    if (elementRef.current) {
      apiRef.current = new AlphaTabApi(elementRef.current, {
        core: {
          //file: "https://www.alphatab.net/files/canon.gp",
          fontDirectory: "./font/",
        },
        player: {
          enablePlayer: true,
          enableCursor: true,
          enableUserInteraction: true,
          soundFont: "./soundfont/sonivox.sf2",
        },
      } as Settings)
      apiRef.current.tex(tex)

      applyColors(apiRef.current.score as unknown as Score)
      console.log("Rendering")
      apiRef.current.renderer.render()

      // setApi(api)
    }
    return () => {
      //console.log("destroy", elementRef, apiRef.current)
      apiRef.current?.destroy()
    }
  }, [tex])
  useEffect(() => {
    const beat =
      apiRef &&
      apiRef.current &&
      apiRef.current.score &&
      props.beat &&
      apiRef.current.score.tracks[0].staves[0].bars[0].voices[0].beats[
        props.beat
      ]
    if (apiRef.current && apiRef.current.tickCache && beat) {
      apiRef.current.tickPosition = apiRef.current.tickCache.getBeatStart(beat)
      apiRef.current.playbackSpeed = 0
    }
  }, [props.beat])
  return (
    <>
      <div style={{ width: 800, overflow: "auto" }} ref={elementRef} />
      <Button
        onClick={() => {
          apiRef.current?.playPause()
        }}
      >
        Play / Pause
      </Button>
    </>
  )
}
