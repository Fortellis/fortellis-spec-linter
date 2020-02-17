const { Spectral } = require('@stoplight/spectral');
const { oas2Functions } = require('@stoplight/spectral/dist/rulesets/oas2');
const rules = require('../../src/rulesets/oas2-fortellis');

describe('rule rwres_f001', () => {
  const s = new Spectral();
  s.addFunctions(oas2Functions());
  s.addRules({
    wres_f001: rules.wres_f001
  });
  s.mergeRules();

  it("should pass if a reponse objects include a 'Request-Id' header", async function() {
    const test = {
      responses: {
        Foo: {
          headers: {
            'Request-Id': {},
            'Accept-Language': {}
          }
        }
      }
    };

    const results = await s.run(test);
    expect(results).toEqual([]);
  });

  it("should fail if response objects do not include a 'Request-Id' header", async function() {
    const test = {
      responses: {
        Foo: {
          headers: {
            'Accept-Language': {}
          }
        }
      }
    };

    const results = await s.run(test);

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty(
      'message',
      'responses should include a `Request-Id` header'
    );
  });
});
