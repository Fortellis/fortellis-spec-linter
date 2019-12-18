const validate = require("../index.js");

describe("fortellis-spec-validator", () => {
  test("should exist", () => {
    expect(validate).toBeDefined();
    expect(typeof validate).toBe("function");
  });
});
