const { Spectral } = require('@stoplight/spectral');
const functions = require('../../src/functions/oas2-fortellis');
const rules = require('../../src/rulesets/oas2-fortellis');

describe('rule wpar_f001', () => {
  const s = new Spectral();
  s.addFunctions(functions);
  s.addRules({
    wpar_f001: rules.wpar_f001
  });
  s.mergeRules();

  it('should pass if parameter key suffix casing matches prefix type', async function() {
    const results = await s.run({
      parameters: {
        'header.Foo-Bar': {},
        'path.fooBar': {},
        'query.foobar': {},
        'body.FooBar': {}
      }
    });

    expect(results).toEqual([]);
  });

  it('should fail if parameter key suffix casing does not match prefix type', async function() {
    const tests = [
      {
        parameters: {
          'header.foobar': {}
        }
      },
      {
        parameters: {
          'path.FooBar': {}
        }
      },
      {
        parameters: {
          'query.foo-bar': {}
        }
      },
      {
        parameters: {
          'body.foobar': {}
        }
      }
    ];

    for (const t of tests) {
      const results = await s.run(t);
      expect(results).toHaveLength(1);
    }
  });
});
