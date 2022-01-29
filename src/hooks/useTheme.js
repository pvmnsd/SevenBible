import defaultThemes from 'src/themes'

export default () => {
  const getUserThemes = () => window.system.getUserThemes()

  const getAllThemes = async () => {
    return [...defaultThemes, ...await getUserThemes()]
  }

  const readDefaultTheme = (themeName) => import(`src/themes/${themeName}.js`)
  const readUserTheme = (themeName) => window.system.readUserTheme(themeName)
  const setCssVars = (theme) => {
    const body = document.body
    body.removeAttribute('style')

    Object.keys(theme).forEach(key => {
      body.style.setProperty('--' + key, theme[key])
    })
  }
  const setTheme = async (themeName) => {
    if (defaultThemes.includes(themeName)) {
      const theme = await readDefaultTheme(themeName)
      setCssVars(theme)
    } else {
      const userThemes = await getUserThemes()
      if (userThemes.includes(themeName)) {
        const theme = await readUserTheme(themeName)
        setCssVars(theme)
      } else {
        const theme = await readDefaultTheme(defaultThemes[0])
        setCssVars(theme)
      }
    }
  }

  return {
    setTheme,
    getAllThemes
  }
}
