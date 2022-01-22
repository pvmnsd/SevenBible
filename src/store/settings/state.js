const settings = JSON.parse(window.system.getSettings())
export default function () {
  return {
    ...settings
  }
}
