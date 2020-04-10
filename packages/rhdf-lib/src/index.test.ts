import { Form, useFormApi } from "./index";

describe("Export contents", () => {
  test("Should be defined", () => {
    expect(useFormApi).toBeDefined();
    expect(Form).toBeDefined();
  });
});
