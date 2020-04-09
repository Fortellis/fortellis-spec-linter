const fs = require('fs');
const path = require('path');
const { lintRaw, Severity } = require('../src');

const DEFAULT_OPTIONS = {
  rulesets: {
    // TODO: function casing not included when enhanced not used although it's referenced
    // in oas2-fortellis
    'oas2-enhanced': true,
    'oas2-fortellis': true
  }
};

async function runTest(filePath, options = DEFAULT_OPTIONS) {
  const bad = fs.readFileSync(path.join(__dirname, filePath), 'utf8');

  return await lintRaw(bad, options);
}

describe('Fortellis Spec Validator', () => {
  describe('Fortellis Ruleset', () => {
    test('Validates Valid Master Spec', async () => {
      const response = await runTest('/specs/oas2-fortellis/master.yaml');
      expect(response).toEqual([]);
    });

    test('Semantic Versioning', async () => {
      const response = await runTest(
        '/specs/oas2-fortellis/semantic-version/bad.yaml'
      );

      expect(response).toHaveLength(1);
      expect(response[0].code).toEqual('einf_f001');
      expect(response[0].message).toEqual(
        'the version should follow semantic versioning: {major-number}.{minor-number}.{patch-number}'
      );
    });

    test('Path Key Kebab Case', async () => {
      const response = await runTest(
        '/specs/oas2-fortellis/path-key-kebab/bad.yaml'
      );

      expect(response).toHaveLength(3);
      expect(response[0].code).toEqual('spat_f001');
      expect(response[0].message).toEqual(
        'path segment `endpointCamel` should be `kebab-case`'
      );
      expect(response[1].code).toEqual('spat_f001');
      expect(response[1].message).toEqual(
        'path segment `Bad-Endpoint` should be `kebab-case`'
      );
      expect(response[2].code).toEqual('spat_f001');
      expect(response[2].message).toEqual(
        'path segment `BadEndpoint` should be `kebab-case`'
      );
    });

    test('Security Definitions', async () => {
      const response = await runTest(
        '/specs/oas2-fortellis/security-definitions/bad.yaml'
      );

      expect(response).toHaveLength(1);
      expect(response[0].code).toEqual('wsdf_f001');
      expect(response[0].message).toEqual(
        'root spec object should declare a `securityDefinitions` object'
      );
    });

    test('Operation Request ID', async () => {
      const response = await runTest(
        '/specs/oas2-fortellis/operation-request-id/bad.yaml'
      );

      expect(response).toHaveLength(1);
      expect(response[0].code).toEqual('wop_f001');
      expect(response[0].message).toEqual(
        'operation objects must declare a `Request-Id` header parameter'
      );
    });

    describe('Parameter Name Format', () => {
      test('Header: Upper Kebab Case', async () => {
        const response = await runTest(
          '/specs/oas2-fortellis/parameter-name-format/bad-header.yaml'
        );

        expect(response).toHaveLength(4);
        // Key
        expect(response[0].code).toEqual('wpar_f001');
        expect(response[0].message).toEqual(
          'suffix is incorrect case. The suffix of `header` parameter objects should be `Upper-Kebab-Case`'
        );
        expect(response[2].code).toEqual('wpar_f001');
        expect(response[2].message).toEqual(
          'suffix is incorrect case. The suffix of `header` parameter objects should be `Upper-Kebab-Case`'
        );
        // Name
        expect(response[1].code).toEqual('wpar_f002');
        expect(response[1].message).toEqual(
          'the `name` property of `header` parameter objects should be `Upper-Kebab-Case`'
        );
        expect(response[3].code).toEqual('wpar_f002');
        expect(response[3].message).toEqual(
          'the `name` property of `header` parameter objects should be `Upper-Kebab-Case`'
        );
      });

      test('Path: Camel Case', async () => {
        const response = await runTest(
          '/specs/oas2-fortellis/parameter-name-format/bad-path.yaml'
        );

        expect(response).toHaveLength(4);
        // Key
        expect(response[0].code).toEqual('wpar_f001');
        expect(response[0].message).toEqual(
          'suffix is incorrect case. The suffix of `path` parameter objects should be `camelCase`'
        );
        expect(response[2].code).toEqual('wpar_f001');
        expect(response[2].message).toEqual(
          'suffix is incorrect case. The suffix of `path` parameter objects should be `camelCase`'
        );
        // Name
        expect(response[1].code).toEqual('wpar_f002');
        expect(response[1].message).toEqual(
          'the `name` property of `path` parameter objects should be `camelCase`'
        );
        expect(response[3].code).toEqual('wpar_f002');
        expect(response[3].message).toEqual(
          'the `name` property of `path` parameter objects should be `camelCase`'
        );
      });

      test('Query: Flat Case', async () => {
        const response = await runTest(
          '/specs/oas2-fortellis/parameter-name-format/bad-query.yaml'
        );

        expect(response).toHaveLength(4);
        // Key
        expect(response[0].code).toEqual('wpar_f001');
        expect(response[0].message).toEqual(
          'suffix is incorrect case. The suffix of `query` parameter objects should be `flatcase`'
        );
        expect(response[2].code).toEqual('wpar_f001');
        expect(response[2].message).toEqual(
          'suffix is incorrect case. The suffix of `query` parameter objects should be `flatcase`'
        );
        // Name
        expect(response[1].code).toEqual('wpar_f002');
        expect(response[1].message).toEqual(
          'the `name` property of `query` parameter objects should be `flatcase`'
        );
        expect(response[3].code).toEqual('wpar_f002');
        expect(response[3].message).toEqual(
          'the `name` property of `query` parameter objects should be `flatcase`'
        );
      });

      test('Body: Pascal Case', async () => {
        const response = await runTest(
          '/specs/oas2-fortellis/parameter-name-format/bad-body.yaml'
        );

        expect(response).toHaveLength(4);
        // Key
        expect(response[0].code).toEqual('wpar_f001');
        expect(response[0].message).toEqual(
          'suffix is incorrect case. The suffix of `body` parameter objects should be `PascalCase`'
        );
        expect(response[2].code).toEqual('wpar_f001');
        expect(response[2].message).toEqual(
          'suffix is incorrect case. The suffix of `body` parameter objects should be `PascalCase`'
        );
        // Name
        expect(response[1].code).toEqual('wpar_f002');
        expect(response[1].message).toEqual(
          'the `name` property of `body` parameter objects should be `PascalCase`'
        );
        expect(response[3].code).toEqual('wpar_f002');
        expect(response[3].message).toEqual(
          'the `name` property of `body` parameter objects should be `PascalCase`'
        );
      });
    });

    test('Response Request ID', async () => {
      const response = await runTest(
        '/specs/oas2-fortellis/response-request-id/bad.yaml'
      );

      expect(response).toHaveLength(1);
      expect(response[0].code).toEqual('wres_f001');
      expect(response[0].message).toEqual(
        'responses should include a `Request-Id` header'
      );
    });

    describe('Definitions Rules', () => {
      test('Example Required', async () => {
        const response = await runTest(
          '/specs/oas2-fortellis/definitions/example/bad.yaml'
        );

        expect(response).toHaveLength(1);
        expect(response[0].code).toEqual('edef_f001');
        expect(response[0].message).toEqual(
          'definition objects should include an `example` property'
        );
      });

      test('Keys Casing', async () => {
        const response = await runTest(
          '/specs/oas2-fortellis/definitions/keys/bad.yaml'
        );

        expect(response).toHaveLength(2);
        expect(response[0].code).toEqual('sdef_f001');
        expect(response[0].message).toEqual(
          'definition object keys should be PascalCase'
        );
        expect(response[1].code).toEqual('sdef_f001');
        expect(response[1].message).toEqual(
          'definition object keys should be PascalCase'
        );
      });

      test('Properties Casing', async () => {
        const response = await runTest(
          '/specs/oas2-fortellis/definitions/properties/bad.yaml'
        );

        expect(response).toHaveLength(2);
        expect(response[0].code).toEqual('sdef_f002');
        expect(response[0].message).toEqual(
          'definition object property names should be camelCase'
        );
        expect(response[1].code).toEqual('sdef_f002');
        expect(response[1].message).toEqual(
          'definition object property names should be camelCase'
        );
      });
    });
  });

  describe('OAS2 Enhanced Ruleset', () => {
    describe('Description Field', () => {
      test('Description Exists', async () => {
        const response = await runTest('/specs/oas2/description/bad.yaml');

        expect(response).toHaveLength(1);
        expect(response[0].code).toEqual('winf001');
        expect(response[0].message).toEqual(
          'the info object should declare a `description` property'
        );
        expect(response[0].severity).toBe(Severity.warn);
      });

      test('Multiline Description', async () => {
        const response = await runTest(
          '/specs/oas2/description/bad-indentation.yaml'
        );

        expect(response).toHaveLength(2);
        expect(response[0].code).toEqual('parser');
        expect(response[0].message).toEqual(
          'Bad indentation of a mapping entry'
        );
        expect(response[0].severity).toBe(Severity.error);
        expect(response[1].code).toEqual('parser');
        expect(response[1].message).toEqual(
          'Can not read a block mapping entry; a multiline key may not be an implicit key'
        );
        expect(response[1].severity).toBe(Severity.error);
      });
    });
  });
});
