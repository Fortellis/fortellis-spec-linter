function regexTestFunction(regExp) {
  return function(input) {
    return regExp.test(input);
  };
}

function responseCodeValidation(targetValue) {
  const findHttpSuccessFn = regexTestFunction(/^[23][0-9][0-9]$/);
  const findHttpFailureFn = regexTestFunction(/^[45][0-9][0-9]$/);

  let errors = [];

  Object.entries(targetValue).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, target]) => {
      const httpCodes = Object.keys(target.responses);
      
      if (!httpCodes.some(findHttpSuccessFn)) {
        errors.push({
          message: "Success response required 2xx, 3xx",
          path: ["paths", path, method, "responses"]
        });
      }

      if (!httpCodes.some(findHttpFailureFn)) {
        errors.push({
          message: "Failure response required 4xx, 5xx",
          path: ["paths", path, method, "responses"]
        });
      }
    });
  });

  return errors;
}

module.exports = responseCodeValidation;
