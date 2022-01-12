export function changeAppSettingsPointly(state, {key, value}) {
  state.programSettings[key] = value
}
export const changeAppSettings = (state, settings) => {
  state.app = {...state.app, ...settings}
}

export const changeModuleState = (state, {id, key, settings}) => {
  state.workPlace[id][key] = {...state.workPlace[id][key], ...settings}
}

export const changeModuleStatePointly = (state, {id, moduleName, key, value}) => {
  state.workPlace[id][moduleName][key] = value
}

// export function changeModuleStateView(state, {id, key, name, name1, value}) {
//   if (name1) state.workPlace[id][key].view[name][name1] = value
//   else state.workPlace[id][key].view[name] = value
// }

export function toggleActiveModule(state, {id, key, name, value}) {
  const arr = state.workPlace[id].bible.view[key].activeModules
  if (value === true) arr.push(name)
  else arr.splice(arr.indexOf(name), 1)
}

export const openNewWorkPlace = state => {
  const notActiveWindow = state.workPlace.find(window => !window.active)
  if (notActiveWindow)
    notActiveWindow.active = true
  else {
    const lastWindowIndex = state.workPlace.length - 1
    state.workPlace.push(JSON.parse(JSON.stringify(state.workPlace[lastWindowIndex])))
  }
}
export const closeWorkPlace = (state, id) => {
  state.workPlace[id].active = false
}

export const toggleModuleState = (state, {id, key, name}) => {
  state.workPlace[id][key][name] = !state.workPlace[id][key][name]
}

export const setState = (state, {path, value}) => {

  Object.setValue(path, state, value)
}
