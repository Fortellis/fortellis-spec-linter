const fs = require('fs');
const path = require('path');
const { lintRaw } = require('../src');

const DEFAULT_OPTIONS = {
  rulesets: {
    'oas2-fortellis': true
  }
};

describe('Fortellis Spec Validator', () => {
  describe('Fortellis Ruleset', () => {
    test('Semantic Versioning', async () => {
      const good = fs.readFileSync(
        path.join(__dirname, '/specs/semantic-version/good.yaml'),
        'utf8'
      );
      const bad = fs.readFileSync(
        path.join(__dirname, '/specs/semantic-version/bad.yaml'),
        'utf8'
      );

      const responseGood = await lintRaw(good, DEFAULT_OPTIONS);
      const responseBad = await lintRaw(bad, DEFAULT_OPTIONS);
      // Good
      expect(responseGood).toEqual([]);
      // Bad
      expect(responseBad).toHaveLength(1);
      expect(responseBad[0].code).toEqual('einf_f001');
      expect(responseBad[0].message).toEqual(
        'the version should follow semantic versioning: {major-nnumber}.{minor-number}.{patch-number}'
      );
    });

    test('Path Key Kebab Case', async () => {
      const good = fs.readFileSync(
        path.join(__dirname, '/specs/path-key-kebab/good.yaml'),
        'utf8'
      );
      // TODO: improve test specs for more cases like path params
      const bad = fs.readFileSync(
        path.join(__dirname, '/specs/path-key-kebab/bad.yaml'),
        'utf8'
      );

      const responseGood = await lintRaw(good, DEFAULT_OPTIONS);
      const responseBad = await lintRaw(bad, DEFAULT_OPTIONS);
      // Good
      expect(responseGood).toEqual([]);
      // Bad
      expect(responseBad).toHaveLength(1);
      expect(responseBad[0].code).toEqual('spat_f001');
      expect(responseBad[0].message).toEqual(
        'path segment `endpointCamel` should be `kebab-case`'
      );
    });

    test('Security Definitions', async () => {
      const good = fs.readFileSync(
        path.join(__dirname, '/specs/security-definitions/good.yaml'),
        'utf8'
      );
      const bad = fs.readFileSync(
        path.join(__dirname, '/specs/security-definitions/bad.yaml'),
        'utf8'
      );

      const responseGood = await lintRaw(good, DEFAULT_OPTIONS);
      const responseBad = await lintRaw(bad, DEFAULT_OPTIONS);
      // Good
      expect(responseGood).toEqual([]);
      // Bad
      expect(responseBad).toHaveLength(1);
      expect(responseBad[0].code).toEqual('wsdf_f001');
      expect(responseBad[0].message).toEqual(
        'root spec object should declare a `securityDefinitions` object'
      );
    });

    test('Operation Request ID', async () => {
      const good = fs.readFileSync(
        path.join(__dirname, '/specs/operation-request-id/good.yaml'),
        'utf8'
      );
      const bad = fs.readFileSync(
        path.join(__dirname, '/specs/operation-request-id/bad.yaml'),
        'utf8'
      );

      const responseGood = await lintRaw(good, DEFAULT_OPTIONS);
      const responseBad = await lintRaw(bad, DEFAULT_OPTIONS);
      // Good
      expect(responseGood).toEqual([]);
      // Bad
      expect(responseBad).toHaveLength(1);
      expect(responseBad[0].code).toEqual('wop_f001');
      expect(responseBad[0].message).toEqual(
        'operation objects must declare a `Request-Id` header parameter'
      );
    });

    describe('Parameter Name Format', () => {
      test('Header: Upper Kebab Case', async () => {
        const bad = fs.readFileSync(
          path.join(__dirname, '/specs/parameter-name-format/bad-header.yaml'),
          'utf8'
        );

        const response = await lintRaw(bad, DEFAULT_OPTIONS);
        expect(response).toHaveLength(2);
        // Key
        expect(response[0].code).toEqual('wpar_f001');
        expect(response[0].message).toEqual(
          'suffix is incorrect case. The suffix of `header` parameter objects should be `Upper-Kebab-Case`'
        );
        // Name
        expect(response[1].code).toEqual('wpar_f002');
        expect(response[1].message).toEqual(
          'the `name` property of `header` parameter objects should be `Upper-Kebab-Case`'
        );
      });
    });

    test('Path: Camel Case', async () => {
      const bad = fs.readFileSync(
        path.join(__dirname, '/specs/parameter-name-format/bad-path.yaml'),
        'utf8'
      );

      const response = await lintRaw(bad, DEFAULT_OPTIONS);
      expect(response).toHaveLength(2);
      // Key
      expect(response[0].code).toEqual('wpar_f001');
      expect(response[0].message).toEqual(
        'suffix is incorrect case. The suffix of `path` parameter objects should be `camelCase`'
      );
      // Name
      expect(response[1].code).toEqual('wpar_f002');
      expect(response[1].message).toEqual(
        'the `name` property of `path` parameter objects should be `camelCase`'
      );
    });
  });
});
