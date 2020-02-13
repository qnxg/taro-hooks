/**
 * 当执行"取消请求"操作时, 抛出Cancel对象作为异常
 * @class
 * @param {string} message
 */
class Cancel {
  message = '';

  __CANCEL__ = true;

  constructor(message: string) {
    this.message = message;
  }

  toString() {
    return this.message ? `Cancel: ${this.message}` : 'Cancel';
  }
}

export default Cancel;
