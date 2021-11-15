export default (changeModuleState, id, key) => {
  changeModuleState({
    key,
    id,
    settings: {
      show: false
    },
  })
}
