window.__I18N_CONFIG__ = window.__I18N_CONFIG__ || {}
const LOCALE_PATH = window.__I18N_CONFIG__.localePath || '/__i18n/'

const I18N = (() => {
  const STORAGE_KEY = 'nr_lang'
  const DEFAULT_LANG = 'en'
  const SUPPORTED_LANGS = ['en', 'yo', 'ha', 'ig', 'pcm']

  let currentLang = DEFAULT_LANG
  let translations = {}
  let fallbackTranslations = {}
  let ready = false

  const listeners = []

  function getSavedLang() {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  }

  function detectBrowserLang() {
    try {
      const lang = (navigator.language || '').slice(0, 2)
      if (SUPPORTED_LANGS.includes(lang)) return lang
    } catch {}
    return DEFAULT_LANG
  }

  function getInitialLang() {
    const saved = getSavedLang()
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved
    return detectBrowserLang()
  }

  async function loadLocale(lang) {
    try {
      const response = await fetch(`${LOCALE_PATH}${lang}.json`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch {
      if (lang !== DEFAULT_LANG) {
        return loadFallback(DEFAULT_LANG)
      }
      return {}
    }
  }

  async function loadFallback(lang) {
    try {
      const response = await fetch(`${LOCALE_PATH}${lang}.json`)
      return await response.json()
    } catch {
      return {}
    }
  }

  function resolveKey(obj, key) {
    return key.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) return acc[part]
      return undefined
    }, obj)
  }

  function translate(key, params = {}) {
    let text = resolveKey(translations, key)
    if (text === undefined) {
      text = resolveKey(fallbackTranslations, key)
    }
    if (text === undefined) return key

    if (params && typeof params === 'object') {
      text = text.replace(/\{(\w+)\}/g, (_, p) => {
        return p in params ? params[p] : `{${p}}`
      })
    }
    return text
  }

  function applyTranslations(root = document) {
    const elements = root.querySelectorAll('[data-i18n]')
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n')
      const attr = el.getAttribute('data-i18n-attr')
      const text = translate(key)

      if (attr) {
        el.setAttribute(attr, text)
      } else {
        el.textContent = text
      }
    })

    const placeholders = root.querySelectorAll('[data-i18n-placeholder]')
    placeholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder')
      el.setAttribute('placeholder', translate(key))
    })

    const titles = root.querySelectorAll('[data-i18n-title]')
    titles.forEach(el => {
      const key = el.getAttribute('data-i18n-title')
      el.setAttribute('title', translate(key))
    })

    const values = root.querySelectorAll('[data-i18n-value]')
    values.forEach(el => {
      const key = el.getAttribute('data-i18n-value')
      el.setAttribute('value', translate(key))
    })
  }

  function setDirection(lang) {
    const dir = translations.meta?.dir || 'ltr'
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', lang)
  }

  function notifyListeners(lang) {
    listeners.forEach(fn => {
      try { fn(lang) } catch {}
    })
  }

  async function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      lang = DEFAULT_LANG
    }

    const newTranslations = await loadLocale(lang)
    if (!newTranslations || Object.keys(newTranslations).length === 0) {
      lang = DEFAULT_LANG
      currentLang = DEFAULT_LANG
      translations = await loadLocale(DEFAULT_LANG)
    } else {
      currentLang = lang
      translations = newTranslations
    }

    try {
      localStorage.setItem(STORAGE_KEY, currentLang)
    } catch {}

    setDirection(currentLang)
    applyTranslations()
    notifyListeners(currentLang)

    document.dispatchEvent(new CustomEvent('i18n:change', {
      detail: { lang: currentLang }
    }))
  }

  async function init() {
    const initial = getInitialLang()
    currentLang = initial

    translations = await loadLocale(initial)
    if (Object.keys(translations).length === 0) {
      currentLang = DEFAULT_LANG
      translations = await loadLocale(DEFAULT_LANG)
    }
    fallbackTranslations = await loadFallback(DEFAULT_LANG)

    setDirection(currentLang)
    applyTranslations()
    ready = true

    document.dispatchEvent(new CustomEvent('i18n:ready', {
      detail: { lang: currentLang }
    }))

    notifyListeners(currentLang)
  }

  function onChange(fn) {
    listeners.push(fn)
    if (ready) {
      try { fn(currentLang) } catch {}
    }
  }

  function getLang() {
    return currentLang
  }

  function getLanguages() {
    return SUPPORTED_LANGS.map(code => ({
      code,
      name: code === 'en' ? 'English' :
            code === 'yo' ? 'Yoruba' :
            code === 'ha' ? 'Hausa' :
            code === 'ig' ? 'Igbo' :
            code === 'pcm' ? 'Pidgin' : code
    }))
  }

  function buildLanguageSwitcher(container, options = {}) {
    const {
      className = 'language-switcher',
      showLabel = false,
      labelKey = 'common.language_switcher_label'
    } = options

    const wrapper = document.createElement('div')
    wrapper.className = className

    if (showLabel) {
      const lbl = document.createElement('span')
      lbl.className = 'language-switcher__label'
      lbl.setAttribute('data-i18n', labelKey)
      lbl.textContent = translate(labelKey)
      wrapper.appendChild(lbl)
    }

    const select = document.createElement('select')
    select.className = 'language-switcher__select'

    const languages = getLanguages()
    languages.forEach(l => {
      const opt = document.createElement('option')
      opt.value = l.code
      opt.textContent = l.name
      if (l.code === currentLang) opt.selected = true
      select.appendChild(opt)
    })

    select.addEventListener('change', (e) => {
      setLanguage(e.target.value)
    })

    wrapper.appendChild(select)
    container.appendChild(wrapper)

    return wrapper
  }

  return {
    init,
    t: translate,
    setLanguage,
    applyTranslations,
    onChange,
    getLang,
    getLanguages,
    buildLanguageSwitcher,
    get supportedLangs() { return SUPPORTED_LANGS }
  }
})()

document.addEventListener('DOMContentLoaded', () => I18N.init())
