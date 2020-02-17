const { Spectral } = require('@stoplight/spectral');
const rules = require('../../src/rulesets/oas2-enhanced');

describe('rule ws001', () => {
  const s = new Spectral();
  s.addRules({
    ws001: rules.ws001
  });
  s.mergeRules();

  it('should pass if the root spec object declares a `parameters` property', async function() {
    const results = await s.run({
      parameters: {}
    });

    expect(results).toEqual([]);
  });

  it('should fail if the root spec object does not declare a `parameters` property', async function() {
    const results = await s.run({});

    expect(results.length).toBe(1);
  });
});
