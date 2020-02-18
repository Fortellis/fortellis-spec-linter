const { Spectral } = require('@stoplight/spectral');
const rules = require('../../src/rulesets/oas2-enhanced');

describe('rule wdef001', () => {
  const s = new Spectral();
  s.addRules({
    wdef001: rules.wdef001
  });
  s.mergeRules();

  it('should pass if definition objects declare a `description` property', async function() {
    const results = await s.run({
      definitions: {
        Foo: {
          description: 'foo'
        },
        Bar: {
          description: 'bar'
        },
        Baz: {
          description: 'baz'
        }
      }
    });

    expect(results).toEqual([]);
  });

  it('should fail if definition objects does not declare a `description` property', async function() {
    const results = await s.run({
      definitions: {
        Foo: {},
        Bar: {},
        Baz: {}
      }
    });

    expect(results.length).toBe(3);
  });
});
