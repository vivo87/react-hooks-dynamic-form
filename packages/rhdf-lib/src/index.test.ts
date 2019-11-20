import { Greeter, Form } from "./index";

describe("Export contents", () => {
  test("Greeter", () => {
    expect(Greeter("John Doe")).toBe("Hello John Doe");
  });

  test("Form should be defined", () => {
    expect(Form).toBeDefined();
  });
});
