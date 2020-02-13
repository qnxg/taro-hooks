import compose from '../compose';

describe('compose', () => {
  it('should throw error Array', async done => {
    expect.assertions(1);
    try {
      compose('');
    } catch (e) {
      expect(e.message).toBe('Middlewares must be an array!');
      done();
    }
  });

  it('should throw error Function', async done => {
    expect.assertions(1);
    try {
      compose([1]);
    } catch (e) {
      expect(e.message).toBe('Middleware must be componsed of function');
      done();
    }
  });
});
