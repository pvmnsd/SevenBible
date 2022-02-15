import {Notify} from "quasar";

interface DefaultSettings {
  timeout?: number,
  position?: any
}

const defaultSettings: DefaultSettings = {
  timeout: 3000,
  position: 'bottom-right'
}

const create = (message: string, classes: string, args?: DefaultSettings) => {
  Notify.create({
    message,
    classes,
    timeout: args?.timeout ?? defaultSettings.timeout,
    position: args?.position ?? defaultSettings.position
  })
}

export const notify = {
  showInfo: (message: string, args?: DefaultSettings) => create(message, 'notify-info', args),
  showWarning: (message: string, args?: DefaultSettings) => create(message, 'notify-warning', args),
  showError: (message: string, args?: DefaultSettings) => create(message, 'notify-error', args),
}
