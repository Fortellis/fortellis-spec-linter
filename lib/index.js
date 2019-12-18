const { Spectral, isOpenApiv2 } = require("@stoplight/spectral");
const {
  getLocationForJsonPath,
  parseWithPointers
} = require("@stoplight/yaml");

const spectral = new Spectral();
spectral.registerFormat("oas2", isOpenApiv2);

function validate(spec) {
  return spectral.loadRuleset(__dirname + "/fortellis-rules.json").then(() => {
    return spectral.run({
      getLocationForJsonPath,
      parsed: parseWithPointers(spec)
    });
  });
}

module.exports = validate;
