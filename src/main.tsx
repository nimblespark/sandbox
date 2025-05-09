import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App"
import { Provider } from "react-redux"
import { store } from "./app/store"
import { GoogleOAuthProvider } from "@react-oauth/google"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="222959330980-3mt12621mfiplbmskp6atnu9oajpuhu5.apps.googleusercontent.com">
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>
)
