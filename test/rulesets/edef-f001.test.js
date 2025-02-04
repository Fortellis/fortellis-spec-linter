const { Spectral } = require('@stoplight/spectral');
const { oas2Functions } = require('@stoplight/spectral/dist/rulesets/oas2');
const rules = require('../../src/rulesets/oas2-fortellis');

describe('rule edef_f001', () => {
  const s = new Spectral();
  s.addFunctions(oas2Functions());
  s.addRules({
    edef_f001: rules.edef_f001
  });
  s.mergeRules();

  it('should pass if definition objects include an `example` property', async function() {
    const results = await s.run({
      definitions: {
        Foo: {
          example: {}
        },
        Bar: {
          example: {}
        },
        Baz: {
          example: {}
        }
      }
    });

    expect(results).toEqual([]);
  });

  it('should fail if definition objects do not include an `example` property', async function() {
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
