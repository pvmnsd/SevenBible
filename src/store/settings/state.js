const settings = JSON.parse(window.system.fsReadFileSync(['user', 'settings', 'settings.json']))

export default function () {
  return {
    ...settings
  }
}
