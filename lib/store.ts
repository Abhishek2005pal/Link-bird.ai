import { create } from 'zustand'

interface AppState {
  sidebarCollapsed: boolean
  selectedLead: string | null
  searchQuery: string
  selectedStatus: string
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSelectedLead: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setSelectedStatus: (status: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  selectedLead: null,
  searchQuery: '',
  selectedStatus: 'all',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedLead: (id) => set({ selectedLead: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
}))