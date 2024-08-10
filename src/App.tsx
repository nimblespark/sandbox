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
    ]
    // { basename: window.location.pathname }
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  )
}
