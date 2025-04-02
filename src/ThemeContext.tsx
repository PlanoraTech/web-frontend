import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(
        (localStorage.getItem("theme") as Theme) || "dark"
    );

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.remove("light-theme");
            document.documentElement.classList.add("dark-theme");
        } else {
            document.documentElement.classList.remove("dark-theme");
            document.documentElement.classList.add("light-theme");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
