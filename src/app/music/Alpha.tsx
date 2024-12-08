import { AlphaTabApi, Settings } from "@coderline/alphatab"
import { Button } from "@mui/material"
import { useEffect, useRef } from "react"

type Props = {
  tex: string
  beat?: number
}

export function Alpha(props: Props) {
  const apiRef = useRef<AlphaTabApi | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const tex = `

      
  \\track "Piano with Grand Staff" "pno."
\\staff{score} \\tuning piano \\instrument 40 \\tempo 60

${props.tex} 

`
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
      apiRef.current.tex(tex)

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
