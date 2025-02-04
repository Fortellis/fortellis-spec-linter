/* eslint-disable no-console */
const { Spectral } = require('@stoplight/spectral');
const {
  getLocationForJsonPath,
  parseWithPointers
} = require('@stoplight/yaml');
const {
  oas2Functions,
  rules: oas2Rules
} = require('@stoplight/spectral/dist/rulesets/oas2');
const oas2EnhancedFunctions = require('./functions/oas2-enhanced');
const oas2EnhancedRules = require('./rulesets/oas2-enhanced');
const oas2FortellisFunctions = require('./functions/oas2-fortellis');
const oas2FortellisRules = require('./rulesets/oas2-fortellis');
const _ = require('lodash');

const { DiagnosticSeverity } = require('@stoplight/types');

const Severity = {
  error: DiagnosticSeverity.Error,
  warn: DiagnosticSeverity.Warning,
  info: DiagnosticSeverity.Information,
  hint: DiagnosticSeverity.Hint
};

async function lintRaw(rawSpec, config) {
  return await lint(parseWithPointers(rawSpec), config);
}

async function lint(
  parserResult,
  { rulesets = {}, severity = Severity.warn, verbose = false }
) {
  try {
    // load functions and rules
    let functions = oas2Functions();
    let rules = await oas2Rules();

    // Merge the rulesets and functions since this is not supported by Spectral v5.X.X
    if (rulesets['oas2-enhanced']) {
      Object.assign(functions, oas2EnhancedFunctions);
      Object.assign(rules, oas2EnhancedRules);
    }
    if (rulesets['oas2-fortellis']) {
      Object.assign(functions, oas2FortellisFunctions);
      Object.assign(rules, oas2FortellisRules);
    }

    const filteredRules = filterRulesBySeverity(
      mapRulesetSeverity(rules),
      severity
    );

    // TODO:
    // Need to devise on the fly ruleset generation as a workaround for Spectral v5.X.X
    // only allowing loadRuleset().  Using addFunctions() and addRules results in
    // deprecation messages being printed to stdout.
    const s = new Spectral();
    s.addFunctions(functions); // generates deprecation message
    s.addRules(filteredRules); // generates deprecation message
    s.mergeRules();

    const results = await s.run({
      parsed: parserResult,
      getLocationForJsonPath
    });

    return sortResults(results);
  } catch (error) {
    if (verbose) {
      console.error({
        message: 'linter error',
        error: error
      });
    }
    throw { message: 'linter error', error: error };
  }
}

function mapRulesetSeverity(ruleset) {
  return _.mapValues(ruleset, mapRuleSeverity);
}

function mapRuleSeverity(rule) {
  const clone = _.cloneDeep(rule);

  if (clone.severity === void 0) {
    // assign a default severity if none is declared
    clone.severity = DiagnosticSeverity.Error;
  } else if (_.isString(clone.severity)) {
    // map from string to severity code
    clone.severity = Severity[clone.severity];
  }

  return clone;
}

function filterRulesBySeverity(rules, severity) {
  const max = severity;
  // Only allow severity levels defined in Severity enum
  if (Object.values(Severity).find(s => s === severity) === undefined)
    throw `invalid diagnostic severity level: ${severity}.`;

  return _.pickBy(rules, r => r.severity <= max);
}

function sortResults(results) {
  return results.sort(compareResult);
}

function compareResult(a, b) {
  // sort first by severity in descending order
  if (a.severity != b.severity) {
    return a.severity - b.severity;
  }

  // sort second on starting line number in ascending order
  return a.range.start.line - b.range.start.line;
}

module.exports = {
  lint,
  lintRaw,
  Severity,
  // Exported for testing
  mapRuleSeverity,
  mapRulesetSeverity,
  filterRulesBySeverity,
  sortResults
};
