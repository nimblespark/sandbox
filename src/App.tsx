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
import { LoginPage } from "./app/HangTime/LoginPage"
import { Chat } from "./Chat"
import { useEffect } from "react"
import { VoiceLeadingErrors } from "./app/music/VoiceLeadingErrors"

export function App() {
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
      { path: "/login", element: <LoginPage /> },
      { path: "/chat", element: <Chat /> },
      { path: "/voice", element: <VoiceLeadingErrors /> },
    ]
    // { basename: window.location.pathname }
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  )
}
