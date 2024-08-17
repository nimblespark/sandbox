import {
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom"
import { RootPage } from "./app/routes/RootPage"
import { TodoPage } from "./app/routes/TodoPage"
import { CounterPage } from "./app/routes/CounterPage"
import { RatingPage } from "./app/routes/RatingPage"
import { LayoutPage } from "./app/routes/LayoutPage"
import { ShiftsPage } from "./app/routes/ShiftsPage"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { MusicPage } from "./app/routes/MusicPage"
import { AlphaTab } from "./app/routes/AlphaPage"
import { useEffect, useRef, useState } from "react"
import { AlphaTabApi, Settings } from "@coderline/alphatab"

export function App() {
  // const elementRef = useRef<HTMLDivElement>(null)
  // const apiRef = useRef<AlphaTabApi | null>(null)

  // useEffect(() => {
  //   console.log("USE EFFECT", elementRef.current)
  //   if (elementRef.current) {
  //     apiRef.current = new AlphaTabApi(elementRef.current, {
  //       core: {
  //         // file: "https://www.alphatab.net/files/canon.gp",
  //         fontDirectory: "/font/",
  //       },
  //       player: {
  //         enablePlayer: true,
  //         enableCursor: true,
  //         enableUserInteraction: true,
  //         soundFont: "/soundfont/sonivox.sf2",
  //       },
  //     } as Settings)

  //     console.log("SETTING TEX", apiRef.current)
  //     apiRef.current.tex(`
  //       \\title "Hello alphaTab"
  //       .
  //       :4 0.6 1.6 3.6 0.5 | 2.5 3.5 0.4 2.4 |
  //           3.4 0.3 2.3 0.2 | 1.2 3.2 0.1 1.1 |
  //           3.1.1
  //     `)

  //     // setApi(api)
  //   }
  //   return () => {
  //     console.log("destroy", elementRef, apiRef.current)
  //     apiRef.current?.destroy()
  //   }
  // }, [])

  // function playPause() {
  //   apiRef.current?.playPause()
  // }
  const router = createHashRouter(
    [
      {
        path: "/",
        element: <RootPage />,
        children: [],
      },
      {
        path: "/todo",
        element: <TodoPage />,
      },
      {
        path: "/counter",
        element: <CounterPage />,
      },
      {
        path: "/rating",
        element: <RatingPage />,
      },
      {
        path: "/layout",
        element: <LayoutPage />,
      },
      {
        path: "/shifts",
        element: <ShiftsPage />,
      },
      {
        path: "/music",
        element: <MusicPage />,
      },
      {
        path: "/alpha",
        element: <AlphaTab onPlayPause={playPause} elementRef={elementRef} />,
      },
    ]
    // { basename: window.location.pathname }
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  )
}
