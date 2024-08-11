import { ResponseType } from './types';

export const NoReasonErrorResponse: Omit<ResponseType, 'data'> = {
  success: false,
  error: 'no_reason',
};
