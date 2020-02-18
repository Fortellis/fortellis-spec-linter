const { Spectral } = require('@stoplight/spectral');
const { oas2Functions } = require('@stoplight/spectral/dist/rulesets/oas2');
const rules = require('../../src/rulesets/oas2-enhanced');

describe('rule winf001', () => {
  const s = new Spectral();
  s.addFunctions(oas2Functions());
  s.addRules({
    winf001: rules.winf001
  });
  s.mergeRules();

  it('should pass if info objects declare a `description` property', async function() {
    const test = {
      info: {
        description: 'foo'
      }
    };

    const results = await s.run(test);
    expect(results).toEqual([]);
  });

  it('should fail if info objects do not declare a `description` property', async function() {
    const test = {
      info: {}
    };

    const results = await s.run(test);
    expect(results).toHaveLength(1);
  });
});
