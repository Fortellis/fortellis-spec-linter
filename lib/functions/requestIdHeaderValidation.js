const HEADER_KEY = "header";
const REQUEST_ID_HEADER = "Request-Id";

function requestIdHeaderValidation(targetValue) {
  let errors = [];

  Object.entries(targetValue).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, target]) => {
      if (!target.parameters) {
        return errors.push({
          message: 'Paths must define the Request-Id parameter and it must be required.',
          path: ["paths", path, method]
        });
      }

      const requestId = target.parameters
        .filter(param => param.in === HEADER_KEY)
        .find(param => param.name === REQUEST_ID_HEADER);

      if (!requestId) {
        return errors.push({
          message: 'Paths must define the Request-Id parameter and it must be required.',
          path: ["paths", path, method, "parameters"]
        });
      }

      if (!requestId.required) {
        return errors.push({
          message: 'Request-Id Header must be labeled required.',
          path: ["paths", path, method, "parameters"]
        });
      }
    });
  });

  return errors;
}

module.exports = requestIdHeaderValidation;
