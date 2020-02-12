import CancelToken from '../cancelToken';
import Cancel from '../cancel';

describe('CancelToken', () => {
  describe('constructor', () => {
    it('check promise is Promise', () => {
      const res = new CancelToken();
      expect(res.promise).toStrictEqual(jasmine.any(Promise));
    });

    it('check resolvePromise is Function', () => {
      const res = new CancelToken();
      expect(String(res.resolvePromise)).toBe('function () { [native code] }');
    });
  });

  describe('reason', () => {
    it('returns a Cancel if cancellation has been requested', () => {
      const token = new CancelToken();
      token.cancel('Operation has been canceled.');
      expect(token.reason).toEqual(jasmine.any(Cancel));
      expect(token.reason.message).toBe('Operation has been canceled.');
    });

    it('returns undefined if cancellation has not been requested', () => {
      const token = new CancelToken();
      expect(token.reason).toBeUndefined();
    });
  });

  describe('promise', () => {
    it('returns a Promise that resolves when cancellation is requested', done => {
      const token = new CancelToken();
      token.promise.then(value => {
        expect(value).toEqual(jasmine.any(Cancel));
        expect(value.message).toBe('Operation has been canceled.');
        done();
      });
      token.cancel('Operation has been canceled.');
    });
  });

  describe('throwIfRequested', () => {
    it('throws if cancellation has been requested', () => {
      // Note: we cannot use expect.toThrowError here as Cancel does not inherit from Error
      const token = new CancelToken();
      token.cancel('Operation has been canceled.');
      try {
        token.throwIfRequested();
        fail('Expected throwIfRequested to throw.');
      } catch (thrown) {
        if (!(thrown instanceof Cancel)) {
          fail(`Expected throwIfRequested to throw a Cancel, but it threw ${thrown}.`);
        }
        expect(thrown.message).toBe('Operation has been canceled.');
      }
    });

    it('does not throw if cancellation has not been requested', () => {
      const token = new CancelToken(() => {});
      token.throwIfRequested();
    });
  });

  describe('source', () => {
    it('returns an object containing token and cancel function', () => {
      const source = CancelToken.source();
      expect(source.token).toEqual(jasmine.any(CancelToken));
      expect(source.cancel).toEqual(jasmine.any(Function));
      expect(source.token.reason).toBeUndefined();
      source.cancel('Operation has been canceled.');
      expect(source.token.reason).toEqual(jasmine.any(Cancel));
      expect(source.token.reason.message).toBe('Operation has been canceled.');
    });
  });
});
