import { useThemeStore } from "./themeStore";

describe("themStore", () => {
  it("should initialize default theme as light", () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe("light");
  });
});
