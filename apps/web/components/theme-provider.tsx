"use client"

import * as React from "react"
import { flushSync } from "react-dom"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

const ThemeChangeContext = React.createContext<{
  changeTheme: (theme: string, animate?: boolean) => void
  toggleTheme: () => void
} | null>(null)

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <ThemeMotion>{children}</ThemeMotion>
    </NextThemesProvider>
  )
}

function ThemeMotion({ children }: { children: React.ReactNode }) {
  const { setTheme, systemTheme } = useTheme()
  const activeTransition = React.useRef<ViewTransition | null>(null)

  const changeTheme = React.useCallback(
    (theme: string, animate = true) => {
      const root = document.documentElement
      const dark =
        theme === "dark" || (theme === "system" && systemTheme === "dark")
      activeTransition.current?.skipTransition()
      activeTransition.current = null
      root.removeAttribute("data-theme-transition")

      if (
        !animate ||
        !document.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        root.classList.contains("dark") === dark
      ) {
        root.setAttribute("data-theme-instant", "")
        flushSync(() => setTheme(theme))
        requestAnimationFrame(() => {
          requestAnimationFrame(() =>
            root.removeAttribute("data-theme-instant")
          )
        })
        return
      }

      root.dataset.themeTransition = dark ? "dark" : "light"
      const transition = document.startViewTransition(() => {
        flushSync(() => setTheme(theme))
      })
      activeTransition.current = transition
      // A hidden tab or an interrupted transition can reject `ready`.
      void transition.ready.catch(() => {})
      void transition.finished
        .catch(() => {})
        .finally(() => {
          if (activeTransition.current === transition) {
            activeTransition.current = null
            root.removeAttribute("data-theme-transition")
          }
        })
    },
    [setTheme, systemTheme]
  )

  const toggleTheme = React.useCallback(() => {
    changeTheme(
      document.documentElement.classList.contains("dark") ? "light" : "dark"
    )
  }, [changeTheme])

  const value = React.useMemo(
    () => ({ changeTheme, toggleTheme }),
    [changeTheme, toggleTheme]
  )

  return (
    <ThemeChangeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeChangeContext.Provider>
  )
}

function useThemeChange() {
  const context = React.useContext(ThemeChangeContext)
  if (!context) throw new Error("Theme controls require ThemeProvider")
  return context
}

const subscribeToHydration = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

// Theme-dependent markup must match the server until hydration has completed.
function useThemePreference() {
  const { theme } = useTheme()
  const hydrated = React.useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot
  )
  return hydrated ? (theme ?? "system") : "system"
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  )
}

function ThemeHotkey() {
  const { changeTheme } = useThemeChange()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.key.toLowerCase() !== "d" ||
        isTypingTarget(event.target)
      )
        return

      changeTheme(
        document.documentElement.classList.contains("dark") ? "light" : "dark",
        false
      )
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [changeTheme])

  return null
}

export { ThemeProvider, useThemeChange, useThemePreference }
