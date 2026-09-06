import { useEffect } from "react"

/** Apply tokens to portals as well as the console; restore them on exit. */
export function useWifiConsoleTheme() {
  useEffect(() => {
    document.documentElement.dataset.wifiConsole = "true"
    return () => { delete document.documentElement.dataset.wifiConsole }
  }, [])
}
