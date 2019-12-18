const responseCodeValidation = require("../responseCodeValidation");

describe("responseCodeValidation function", () => {
  test("should exist", () => {
    expect(responseCodeValidation).toBeDefined();
    expect(typeof responseCodeValidation).toBe("function");
  });
});
