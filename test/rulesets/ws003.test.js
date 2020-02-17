const { Spectral } = require('@stoplight/spectral');
const { oas2Functions } = require('@stoplight/spectral/dist/rulesets/oas2');
const rules = require('../../src/rulesets/oas2-enhanced');

describe('rule ws003', () => {
  const s = new Spectral();
  s.addFunctions(oas2Functions());
  s.addRules({
    ws003: rules.ws003
  });
  s.mergeRules();

  it("should pass if the root spec object declares a 'definitions' property", async function() {
    const results = await s.run({
      definitions: {}
    });

    expect(results).toEqual([]);
  });

  it("should fail if the root spec object does not declare a 'definitions' property", async function() {
    const results = await s.run({});

    expect(results.length).toBe(1);
  });
});
