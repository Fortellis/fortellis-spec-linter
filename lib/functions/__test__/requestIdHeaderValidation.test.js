const requestIdHeaderValidation = require("../requestIdHeaderValidation");

describe("requestIdHeaderValidation function", () => {
  test("should exist", () => {
    expect(requestIdHeaderValidation).toBeDefined();
    expect(typeof requestIdHeaderValidation).toBe("function");
  });
});
