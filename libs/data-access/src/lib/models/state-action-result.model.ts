export enum StateActionMessageStatus {
  success = 'success',
  failure = 'failure',
}

export interface StateActionMessage<T = any> {
  status: StateActionMessageStatus;
  result: { error?: any; value?: T };
}
