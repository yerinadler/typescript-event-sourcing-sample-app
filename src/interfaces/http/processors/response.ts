export const ok = (message: string, data: any) => ({
  status: '000',
  message: message || 'Success',
  data,
});
