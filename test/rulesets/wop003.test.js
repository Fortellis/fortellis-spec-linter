const { Spectral } = require('@stoplight/spectral');
const rules = require('../../src/rulesets/oas2-enhanced');

describe('rule wop003', () => {
  const s = new Spectral();
  s.addRules({
    wop003: rules.wop003
  });
  s.mergeRules();

  it('should pass if operation objects declare a `description` property', async function() {
    const test = {
      paths: {
        '/': {
          get: {
            description: {}
          }
        }
      }
    };

    const results = await s.run(test);
    expect(results).toEqual([]);
  });

  it('should fail if the root spec object does not declare a `description` property', async function() {
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
