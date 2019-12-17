function isCamelCase(targetValue) {
  const re = /[a-z]+((\\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?/;
  const [result] = re.exec(targetValue);
  return result.includes(targetValue);
}

function definitionsCamelCase(targetValue) {
  const errors = [];

  Object.entries(targetValue).forEach((def, properties) => {
    Object.keys(properties.properties).forEach(property => {
      if (!isCamelCase(property)) {
        errors.push({
          message:
            "Definition properties should be in camelCase or snake_case and contain only alphanumeric characters",
          path: ["definitions", def, "properties", property]
        });
      }
    });
  });
  
  return errors;
}

module.exports = definitionsCamelCase;