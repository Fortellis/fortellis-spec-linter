const { casing } = require('../../src/functions/oas2-enhanced');

describe('caseTypes', function() {
  it('should pass kebab-case strings', async function() {
    const test = [
      {
        targetVal: 'foo',
        expected: []
      },
      {
        value: 'foo-bar',
        expected: []
      }
    ];

    for (const t of test) {
      const results = casing(t.value, { casing: 'kebabCase' });
      expect(results).toEqual(t.expected);
    }
  });

  it('should fail non-kebab-case strings', async function() {
    const test = [
      {
        targetVal: 'foo-bar-',
        expected: '`foo-bar-` should be `kebab-case`'
      },
      {
        targetVal: '1foo-bar',
        expected: '`1foo-bar` should be `kebab-case`'
      },
      {
        targetVal: '-foo-bar',
        expected: '`-foo-bar` should be `kebab-case`'
      },
      {
        targetVal: 'FooBar',
        expected: '`FooBar` should be `kebab-case`'
      },
      {
        targetVal: 'Foo-Bar',
        expected: '`Foo-Bar` should be `kebab-case`'
      }
    ];

    for (const t of test) {
      const results = casing(t.targetVal, { casing: 'kebabCase' });
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('message', t.expected);
    }
  });

  it('should pass PascalCase strings', async function() {
    const test = [
      {
        value: 'Foo'
      },
      {
        value: 'FooBar'
      },
      {
        value: 'Foo123'
      }
    ];

    for (const t of test) {
      const results = casing(t.value, { casing: 'pascalCase' });
      expect(results).toEqual([]);
    }
  });

  it('should fail non-PascalCase strings', async function() {
    const test = [
      {
        value: '123Bar',
        expected: '`123Bar` should be `PascalCase`'
      },
      {
        value: 'fooBar',
        expected: '`fooBar` should be `PascalCase`'
      }
    ];

    for (const t of test) {
      const results = casing(t.value, { casing: 'pascalCase' });
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('message', t.expected);
    }
  });
});
