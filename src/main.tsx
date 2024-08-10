import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App"
import { Provider } from "react-redux"
import { store } from "./app/store"
import { RouterProvider } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <h1>REACT APP</h1>
    </Provider>
  </React.StrictMode>
)
