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

import { MelodyPage } from "./app/routes/music/MelodyPage"
import { MonopolyBoardComponent, MonopolyPage } from "./app/routes/MonopolyPage"
import { MonopolyResultsPage } from "./app/monopoly/MonopolyResultsPage"
import { MathPage } from "./app/routes/MathPage"
import { MathQuiz } from "./app/routes/MathQuiz"
import { IntervalQuiz } from "./app/routes/music/IntervalQuiz"
import { MusicPage } from "./app/routes/music/MusicPage"
import { PianoPage } from "./app/routes/music/PianoPage"
import { ProgressionPage } from "./app/routes/music/ProgressionPage"
import { SheetMusicPage } from "./app/routes/music/SheetMusic"
import { PodcastPage } from "./app/routes/Podcast"

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
      // {
      //   path: "/alpha:chord",
      //   element: <AlphaTab />,
      // },
      { path: "/progression", element: <ProgressionPage /> },
      {
        path: "/math",
        element: <MathPage />,
      },
      {
        path: "/quiz",
        element: <MathQuiz />,
      },
      {
        path: "/piano",
        element: <PianoPage />,
      },
      { path: "/interval", element: <IntervalQuiz /> },
      { path: "/sheet", element: <SheetMusicPage /> },
      { path: "/melody", element: <MelodyPage /> },
      {
        path: "/monopoly",
        element: <MonopolyPage />,
      },
      {
        path: "/monopoly-results",
        element: <MonopolyResultsPage />,
      },
      { path: "/podcast", element: <PodcastPage /> },
    ]
    // { basename: window.location.pathname }
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  )
}
