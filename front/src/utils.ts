export const exposesAppError: {(obj: any): boolean} = (obj): boolean => {
  return obj.hasOwnProperty('message') && obj.hasOwnProperty('status')
}