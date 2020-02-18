const { Spectral } = require('@stoplight/spectral');
const functions = require('../../src/functions/oas2-enhanced');
const rules = require('../../src/rulesets/oas2-fortellis');

describe('rule sdef_f001', () => {
  const s = new Spectral();
  s.addFunctions({
    casing: functions.casing
  });
  s.addRules({
    sdef_f001: rules.sdef_f001
  });
  s.mergeRules();

  it('should pass if definiton object keys are `PascalCase`', async function() {
    const results = await s.run({
      definitions: {
        Foo: {},
        Bar: {},
        Baz: {}
      }
    });

    expect(results).toEqual([]);
  });

  it('should fail if definiton object keys are not `PascalCase`', async function() {
    const tests = [
      {
        definitions: {
          foo: {}
        }
      },
      {
        definitions: {
          'Bar-Bar': {}
        }
      },
      {
        definitions: {
          bazBaz: {}
        }
      }
    ];

    for (const t of tests) {
      const results = await s.run(t);
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty(
        'message',
        'defintion object keys should be PascalCase'
      );
    }
  });
});
