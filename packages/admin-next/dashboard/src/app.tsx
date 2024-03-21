import { Toaster } from "@medusajs/ui"
import { MedusaProvider } from "medusa-react"

import { RouterProvider } from "./providers/router-provider"
import { ThemeProvider } from "./providers/theme-provider"

import { MEDUSA_BACKEND_URL, queryClient } from "./lib/medusa"
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {
  return (
    <MedusaProvider
      baseUrl={MEDUSA_BACKEND_URL}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <GoogleOAuthProvider clientId="1002468687003-sch09a6fn5vj1dbak36r4su02irhjgnu.apps.googleusercontent.com">
        <ThemeProvider>
          <RouterProvider />
          <Toaster />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </MedusaProvider>
  )
}

export default App
