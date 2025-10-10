import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { AntdStylesProvider } from "@/app/providers/AntdStylesProvider.tsx";

type Theme = "light" | "dark";

type TThemeContext = {
    theme: Theme;
    toggleTheme: () => void;
};

type TProps = {
    children: ReactNode;
};

const ThemeContext = createContext<TThemeContext>({} as TThemeContext);

export const ThemeProvider = ({ children }: TProps) => {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        setTheme(savedTheme || (systemDark ? "dark" : "light"));
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("theme")) {
                setTheme(e.matches ? "dark" : "light");
            }
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        document.body.classList.remove("body--light", "body--dark");
        document.body.classList.add(`body--${theme}`);
        document.body.style.colorScheme = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <AntdStylesProvider theme={theme}>{children}</AntdStylesProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
