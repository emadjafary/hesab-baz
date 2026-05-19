import { StateCreator } from 'zustand'

export interface DashboardSlice {
  valueVisible: boolean
  toggleValueVisible: () => void
}

export const createDashboardSlice: StateCreator<DashboardSlice> = (set) => ({
  valueVisible: true,
  toggleValueVisible: () => set((s) => ({ valueVisible: !s.valueVisible })),
})
