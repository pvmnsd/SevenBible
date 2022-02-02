import {Notify} from "quasar";

export default () => {
  const create = (message, classes, {timeout = 3000, position = 'bottom-right'} = {}) => {
    Notify.create({
      message,
      timeout,
      position,
      classes
    })
  }
  const showInfo = (message, args) => create(message, 'notify-info', args)
  const showWarning = (message, args) => create(message, 'notify-warning', args)
  const showError = (message, args) => create(message, 'notify-error', args)

  return {
    showInfo,
    showWarning,
    showError
  }
}
