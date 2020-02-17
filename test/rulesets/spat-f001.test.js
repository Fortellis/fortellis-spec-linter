const { Spectral } = require('@stoplight/spectral');
const functions = require('../../src/functions/oas2-fortellis');
const rules = require('../../src/rulesets/oas2-fortellis');

describe('rule spat_f001', () => {
  const s = new Spectral();
  s.addFunctions({
    fortellisPathCasing: functions.fortellisPathCasing
  });
  s.addRules({
    spat_f001: rules.spat_f001
  });
  s.mergeRules();

  it('should pass for paths with `kebab-case` segments', async function() {
    const tests = [
      {
        spec: {
          paths: {
            '/foo': {}
          }
        },
        expected: []
      },
      {
        spec: {
          paths: {
            '/foo-bar': {}
          }
        },
        expected: []
      },
      {
        spec: {
          paths: {
            '/{fooId}': {}
          }
        },
        expected: []
      },
      {
        spec: {
          paths: {
            '/foo/{barId}': {}
          }
        },
        expected: []
      },
      {
        spec: {
          paths: {
            '/foo/{barId}/baz': {}
          }
        },
        expected: []
      }
    ];

    for (const t of tests) {
      const results = await s.run(t.spec);
      expect(results).toEqual(t.expected);
    }
  });

  it('should fail for paths with non-`kebab-case` segments', async function() {
    const tests = [
      {
        spec: {
          paths: {
            '/FooBar': {}
          }
        },
        expected: 'path segment `FooBar` should be `kebab-case`'
      },
      {
        spec: {
          paths: {
            '/FooBar/{bazId}': {}
          }
        },
        expected: 'path segment `FooBar` should be `kebab-case`'
      },
      {
        spec: {
          paths: {
            '/{fooId}/Baz-Bam': {}
          }
        },
        expected: 'path segment `Baz-Bam` should be `kebab-case`'
      }
    ];

    for (const t of tests) {
      const results = await s.run(t.spec);
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('message', t.expected);
    }
  });
});
