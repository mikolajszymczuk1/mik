import { readonly, ref, type Ref } from 'vue'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEYS = {
  themeMode: 'mik-theme-mode',
  accentIndex: 'mik-accent-index',
} as const

const ACCENT_COLORS = ['#ff871f', '#4f8cff', '#26c485', '#ef476f', '#a855f7'] as const
const DEFAULT_ACCENT_INDEX = 0
const DEFAULT_THEME_MODE: ThemeMode = 'light'

const themeMode: Ref<ThemeMode> = ref(DEFAULT_THEME_MODE)
const accentIndex: Ref<number> = ref(DEFAULT_ACCENT_INDEX)
let initialized = false

const isThemeMode = (value: string | null): value is ThemeMode => {
  return value === 'light' || value === 'dark'
}

const getSavedAccentIndex = (): number => {
  const savedAccentIndex = Number(localStorage.getItem(STORAGE_KEYS.accentIndex))

  if (Number.isInteger(savedAccentIndex) && ACCENT_COLORS[savedAccentIndex]) {
    return savedAccentIndex
  }

  return DEFAULT_ACCENT_INDEX
}

const applyThemeMode = (value: ThemeMode): void => {
  document.documentElement.dataset.theme = value
  localStorage.setItem(STORAGE_KEYS.themeMode, value)
}

const applyAccentColor = (index: number): void => {
  const accentColor = ACCENT_COLORS[index] ?? ACCENT_COLORS[DEFAULT_ACCENT_INDEX]

  document.documentElement.style.setProperty('--color-game-accent', accentColor)
  localStorage.setItem(STORAGE_KEYS.accentIndex, String(index))
}

export const useThemeSettings = () => {
  const initializeThemeSettings = (): void => {
    if (initialized) return

    const savedThemeMode = localStorage.getItem(STORAGE_KEYS.themeMode)

    themeMode.value = isThemeMode(savedThemeMode) ? savedThemeMode : DEFAULT_THEME_MODE
    accentIndex.value = getSavedAccentIndex()

    applyThemeMode(themeMode.value)
    applyAccentColor(accentIndex.value)

    initialized = true
  }

  const toggleThemeMode = (): void => {
    themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
    applyThemeMode(themeMode.value)
  }

  const changeAccentColor = (): void => {
    accentIndex.value = (accentIndex.value + 1) % ACCENT_COLORS.length
    applyAccentColor(accentIndex.value)
  }

  return {
    themeMode: readonly(themeMode),
    accentIndex: readonly(accentIndex),
    accentColors: ACCENT_COLORS,

    initializeThemeSettings,
    toggleThemeMode,
    changeAccentColor,
  }
}
