export const SuccessResponse = <T>(message: string, data?: T) => ({
  status: 'success',
  message,
  data,
});

export const ErrorResponse = (message: string) => ({
  status: 'error',
  message,
  data: null,
});
