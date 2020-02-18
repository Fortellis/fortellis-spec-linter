const { Spectral } = require('@stoplight/spectral');
const functions = require('../../src/functions/oas2-fortellis');
const rules = require('../../src/rulesets/oas2-fortellis');

describe('rule wpar_f002', () => {
  const s = new Spectral();
  s.addFunctions(functions);
  s.addRules({
    wpar_f002: rules.wpar_f002
  });
  s.mergeRules();

  it('should pass if `name` propery casing matches type specified by `in` property', async function() {
    const results = await s.run({
      parameters: {
        'header.Foo-Bar': {
          name: 'Foo-Bar',
          in: 'header'
        },
        'path.foo-bar': {
          name: 'fooBar',
          in: 'path'
        },
        'query.foobar': {
          name: 'fooBar',
          in: 'query'
        },
        'body.FooBar': {
          name: 'FooBar',
          in: 'body'
        }
      }
    });

    expect(results).toEqual([]);
  });

  it('should fail if `name` propery casing does not match type specified by `in` property', async function() {
    const tests = [
      {
        input: {
          parameters: {
            'header.foobar': {
              name: 'foobar',
              in: 'header'
            }
          }
        },
        expected:
          'the `name` property of `header` parameter objects should be `Upper-Kebab-Case`'
      },
      {
        input: {
          parameters: {
            'path.FooBar': {
              name: 'FooBar',
              in: 'path'
            }
          }
        },
        expected:
          'the `name` property of `path` parameter objects should be `camelCase`'
      },
      {
        input: {
          parameters: {
            'query.foo-bar': {
              name: 'foo-bar',
              in: 'query'
            }
          }
        },
        expected:
          'the `name` property of `query` parameter objects should be `camelCase`'
      },
      {
        input: {
          parameters: {
            'body.foobar': {
              name: 'foobar',
              in: 'body'
            }
          }
        },
        expected:
          'the `name` property of `body` parameter objects should be `PascalCase`'
      }
    ];

    for (const t of tests) {
      const results = await s.run(t.input);
      expect(results.length).toBe(1);
      expect(results[0]).toHaveProperty('message', t.expected);
    }
  });
});
