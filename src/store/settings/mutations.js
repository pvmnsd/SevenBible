export function changeProgramSettings(state, {key, value}) {
  state.programSettings[key] = value
}

export const changeModuleState = (state, {id, key, settings}) => {
  state.windows[id][key] = {...state.windows[id][key], ...settings}
}

export function changeModuleStateView(state, {id = 0, key, name, name1, value}) {
  if (name1) state.windows[id][key].view[name][name1] = value
  else state.windows[id][key].view[name] = value
}

export function changeActiveModules(state, {id = 0, key, name, value}) {
  const arr = state.windows[id].bible.view[key].activeModules
  if (value === true) arr.push(name)
  else arr.splice(arr.indexOf(name), 1)
}

export const openNewWindow = state => {
  const notActiveWindow = state.windows.find(window => !window.active)
  if (notActiveWindow)
    notActiveWindow.active = true
}
export const closeWindow = (state, id) => {
  state.windows[id].active = false
}

export const toggleModuleState = (state, {id, key, name}) => {
  state.windows[id][key][name] = !state.windows[id][key][name]
}
