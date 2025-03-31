import { useThemeStore } from "./themeStore";

describe("themStore", () => {
  it("should initialize default theme as light", () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe("light");
  });
});

describe("toggleTheme", () => {
  it("should change theme to dark when current is light", () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");
  });
  it("should change to light when current is dark", () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
  });
  it("should toggle correctly multiple times", () => {
    const { toggleTheme } = useThemeStore.getState();

    toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");
    toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
    toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");
  });
});
