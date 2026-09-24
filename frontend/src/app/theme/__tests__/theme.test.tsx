import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { ThemeContextProvider, useThemeMode } from "../ThemeContext";
import { getAppTheme } from "../theme";

describe("Theme System (AUDIT-03)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeContextProvider defaultMode="dark">{children}</ThemeContextProvider>
  );

  it("exports valid dark and light MUI themes with high contrast colors", () => {
    const darkTheme = getAppTheme("dark");
    const lightTheme = getAppTheme("light");

    expect(darkTheme.palette.mode).toBe("dark");
    expect(darkTheme.palette.background.default).toBe("#121416");
    expect(darkTheme.palette.primary.main).toBe("#6366f1");

    expect(lightTheme.palette.mode).toBe("light");
    expect(lightTheme.palette.background.default).toBe("#F1F3F9");
    expect(lightTheme.palette.text.primary).toBe("#0F172A");
    expect(lightTheme.palette.primary.main).toBe("#4f46e5");
  });

  it("initializes with default mode and synchronizes document data-theme", () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    expect(result.current.mode).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("updates mode and persists to localStorage on setMode", () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    act(() => {
      result.current.setMode("light");
    });

    expect(result.current.mode).toBe("light");
    expect(result.current.resolvedTheme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("rideplanner_theme")).toBe("light");
  });

  it("toggles between dark and light modes with toggleTheme", () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.resolvedTheme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("renders ThemeToggle component and switches modes on click", async () => {
    render(
      <ThemeContextProvider defaultMode="dark">
        <ThemeToggle />
      </ThemeContextProvider>
    );

    const lightBtn = screen.getByRole("button", { name: /Daylight Mode/i });
    const darkBtn = screen.getByRole("button", { name: /Obsidian Dark/i });
    const autoBtn = screen.getByRole("button", { name: /Follow System Preference/i });

    expect(lightBtn).toBeInTheDocument();
    expect(darkBtn).toBeInTheDocument();
    expect(autoBtn).toBeInTheDocument();

    // Click Light
    await userEvent.click(lightBtn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("rideplanner_theme")).toBe("light");

    // Click Dark
    await userEvent.click(darkBtn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("rideplanner_theme")).toBe("dark");

    // Click Auto
    await userEvent.click(autoBtn);
    expect(localStorage.getItem("rideplanner_theme")).toBe("system");
  });
});
