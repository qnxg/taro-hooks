import addfix from '../addfix';

describe('addfix', () => {
  it('prefix', () => {
    const res = addfix('/test', { prefix: '/api/v1' });
    expect(res.url).toBe('/api/v1/test');
  });

  it('suffix', () => {
    const res = addfix('/test', { suffix: '.json' });
    expect(res.url).toBe('/test.json');
  });

  it('both prefix and suffix', () => {
    const res = addfix('/test', { prefix: '/api/v1', suffix: '.json' });
    expect(res.url).toBe('/api/v1/test.json');
  });
});
