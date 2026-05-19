import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  createAssetsSlice,
  AssetsSlice,
} from '@/features/assets/store/assetsSlice'

type StoreState = AssetsSlice

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAssetsSlice(...a),
    }),
    {
      name: 'hesab-baz-store',
      storage: createJSONStorage(() => localStorage),
      // فقط داده‌های ماندگار را ذخیره می‌کنیم؛ flagهای UI پاک می‌مانند
      partialize: (s) => ({
        assets: s.assets,
        lastGlobalRefresh: s.lastGlobalRefresh,
      }) as Partial<StoreState>,
    },
  ),
)
