import { createContext, useContext } from 'react'

export const MobileSearchModeContext = createContext<(active: boolean) => void>(() => {})

export function useMobileSearchMode() {
  return useContext(MobileSearchModeContext)
}
