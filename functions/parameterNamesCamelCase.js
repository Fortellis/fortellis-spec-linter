REQUIRED_PARAMS = ["path", "query", "formData"];

function isCamelCase(targetValue) {
  const re = /[a-z]+((\\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?/;
  const [result] = re.exec(targetValue);
  return result.includes(targetValue);
}

function parameterNamesCamelCase(targetValue) {
  const errors = [];

  Object.entries(targetValue).forEach((path, pathObj) => {
    Object.entries(pathObj).forEach((method, methodObj) => {
      if (methodObj.parameters) {
        methodObj.parameters.forEach(param => {
          if (param.in && REQUIRED_PARAMS.includes(param.in)) {
            if (!isCamelCase(param.name)) {
              errors.push({
                message: `Parameter names with type ${REQUIRED_PARAMS.join(
                  "/"
                )} should be in camelCase or snake_case and contain only alphanumeric characters`,
                path: ["paths", path, method, "parameters", param.name]
              });
            }
          }
        });
      }
    });
  });

  return errors;
}

module.exports = parameterNamesCamelCase;
