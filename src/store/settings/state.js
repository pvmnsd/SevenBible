const settings = JSON.parse(window.api.system.getSettings())

export default function () {
  return {
    ...settings
  }
}
