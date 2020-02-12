import Cancel from './cancel';

export default function isCancel(value: Cancel) {
  return !!(value && value.__CANCEL__);
}
