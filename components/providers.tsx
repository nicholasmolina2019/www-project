// app/providers.tsx

"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { FormDataProvider } from "@/context/FormDataContext" // Adjust the path as needed

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <FormDataProvider>
        {children}
      </FormDataProvider>
    </ThemeProvider>
  )
}
