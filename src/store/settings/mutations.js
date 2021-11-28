export function changeProgramSettingsPointly(state, {key, value}) {
  state.programSettings[key] = value
}
export const changeProgramSettings = (state, settings) => {
  state.programSettings = {...state.programSettings, ...settings}
}

export const changeModuleState = (state, {id, key, settings}) => {
  state.windows[id][key] = {...state.windows[id][key], ...settings}
}

export const changeModuleStatePointly = (state, {id, moduleName, key, value}) => {
  state.windows[id][moduleName][key] = value
}

export function changeModuleStateView(state, {id, key, name, name1, value}) {
  if (name1) state.windows[id][key].view[name][name1] = value
  else state.windows[id][key].view[name] = value
}

export function changeActiveModules(state, {id, key, name, value}) {
  const arr = state.windows[id].bible.view[key].activeModules
  if (value === true) arr.push(name)
  else arr.splice(arr.indexOf(name), 1)
}

export const openNewWindow = state => {
  const notActiveWindow = state.windows.find(window => !window.active)
  if (notActiveWindow)
    notActiveWindow.active = true
  else {
    const lastWindowIndex = state.windows.length - 1
    state.windows.push(JSON.parse(JSON.stringify(state.windows[lastWindowIndex])))
  }
}
export const closeWindow = (state, id) => {
  state.windows[id].active = false
}

export const toggleModuleState = (state, {id, key, name}) => {
  state.windows[id][key][name] = !state.windows[id][key][name]
}
