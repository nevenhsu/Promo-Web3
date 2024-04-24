import { createLocalizedPathnamesNavigation } from 'next-intl/navigation'
import { i18nConfig } from './i18n'

// wrapped navigation with next-intl
export const { Link, redirect, usePathname, useRouter } = createLocalizedPathnamesNavigation(i18nConfig)
