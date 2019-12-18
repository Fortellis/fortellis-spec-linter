const parameterNamesCamelCase = require("../parameterNamesCamelCase");

describe("parameterNamesCamelCase function", () => {
  test("should exist", () => {
    expect(parameterNamesCamelCase).toBeDefined();
    expect(typeof parameterNamesCamelCase).toBe("function");
  });
});
