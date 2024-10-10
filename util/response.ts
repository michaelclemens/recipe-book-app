export enum ResponseStatus {
  success = 'success',
  error = 'error',
}

type StatusTypes = keyof typeof ResponseStatus
type ErrorType = { path: string; message?: string }

export default class Response {
  static json(status: StatusTypes, { payload, errors }: { payload?: unknown; errors?: ErrorType[] }) {
    return { status, payload, errors }
  }
}
