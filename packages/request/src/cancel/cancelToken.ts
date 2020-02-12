import Cancel from './cancel';

/**
 * 通过 CancelToken 来取消请求操作
 *
 * @class
 * @param {Function} executor The executor function.
 */
class CancelToken {
  promise: Promise<Cancel>;

  reason: Cancel | undefined;

  resolvePromise: undefined | ((value?: any) => void);

  constructor() {
    this.promise = new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }

  cancel(message: string) {
    if (this.reason) {
      // 取消操作已被调用过
      return;
    }

    this.reason = new Cancel(message);
    if (this.resolvePromise) {
      this.resolvePromise(this.reason);
    } else {
      throw new TypeError('resolvePromise() must be defined');
    }
  }

  /**
   * 请求取消, 抛出Cancel异常
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  source(): { token: CancelToken; cancel: (message: string) => void } {
    return {
      token: this,
      cancel: this.cancel,
    };
  }
}

export default CancelToken;
