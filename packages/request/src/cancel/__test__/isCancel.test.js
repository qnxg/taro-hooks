import isCancel from '../isCancel';
import Cancel from '../cancel';

describe('isCancel', () => {
  it('returns true if value is a Cancel', () => {
    expect(isCancel(new Cancel())).toBe(true);
  });

  it('returns false if value is not a Cancel', () => {
    expect(isCancel({ hello: 'world' })).toBe(false);
  });
});
