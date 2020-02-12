import Onion from '../index';

describe('Onion', () => {
  beforeAll(() => {
    Onion.globalMiddlewares = [];
  });

  it('test constructor', async () => {
    expect.assertions(1);
    try {
      const onion = new Onion();
      onion.use(async () => {});
    } catch (error) {
      expect(error.message).toBe('Default middlewares must be an array!');
    }
  });

  it('middleware should be function', async () => {
    expect.assertions(1);
    try {
      const onion = new Onion([]);
      onion.use('not a function');
      onion.execute();
    } catch (error) {
      expect(error.message).toBe('Middleware must be componsed of function');
    }
  });

  it('multiple next should not be call in a middleware', async () => {
    expect.assertions(1);
    try {
      const onion = new Onion([]);
      onion.use(async (ctx, next) => {
        await next();
        await next();
      });
      await onion.execute();
    } catch (error) {
      expect(error.message).toBe('next() should not be called multiple times in one middleware!');
    }
  });

  it('test middleware of throw error', async () => {
    expect.assertions(1);
    try {
      const onion = new Onion([]);
      onion.use(async (ctx, next) => {
        await next();
      });
      onion.use(async () => {
        throw new Error('error in middleware');
      });
      await onion.execute();
    } catch (error) {
      expect(error.message).toBe('error in middleware');
    }
  });

  it('should warning when options is number', async done => {
    const onion = new Onion([]);
    expect(() => {
      onion.use(async (ctx, next) => {
        await next();
      }, 1);
    }).toThrowError(TypeError, 'use() options should be object');
    process.env.NODE_ENV = 'test';
    done();
  });

  it('should have 1 global middleware', async done => {
    const onion = new Onion([]);
    onion.use(
      async (ctx, next) => {
        await next();
      },
      { global: true },
    );
    expect(Onion.globalMiddlewares.length).toBe(1);
    done();
  });
});
