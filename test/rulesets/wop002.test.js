const { Spectral } = require('@stoplight/spectral');
const rules = require('../../src/rulesets/oas2-enhanced');

describe('rule wop002', () => {
  const s = new Spectral();
  s.addRules({
    wop002: rules.wop002
  });
  s.mergeRules();

  it('should pass if operation objects declare a `summary` property', async function() {
    const test = {
      paths: {
        '/': {
          get: {
            summary: {}
          }
        }
      }
    };

    const results = await s.run(test);
    expect(results).toEqual([]);
  });

  it('should fail if the root spec object does not declare a `summary` property', async function() {
    const test = {
      paths: {
        '/': {
          get: {}
        }
      }
    };

    const results = await s.run(test);
    expect(results).toHaveLength(1);
  });
});
