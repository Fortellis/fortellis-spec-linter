const { Spectral, isOpenApiv2 } = require("@stoplight/spectral");
const {
  getLocationForJsonPath,
  parseWithPointers
} = require("@stoplight/yaml");

const ruleset = require("./fortellis-rules.json");

const spectral = new Spectral();
spectral.setRuleset(ruleset);
spectral.registerFormat("oas2", isOpenApiv2);

function validate(spec) {
  return spectral.loadRuleset("spectral:oas2").then(() => {
    return spectral
      .run({
        getLocationForJsonPath,
        parsed: parseWithPointers(spec)
      })
      .then(console.log);
  });
}

module.exports = validate;
