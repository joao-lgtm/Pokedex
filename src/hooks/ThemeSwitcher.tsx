import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
    theme: boolean;
    handleThemeSwitch: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeSwitchProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem("@theme:theme");
            return saved ? JSON.parse(saved) : true;
        } catch {
            return true;
        }
    });

    async function handleThemeSwitch () {
        
        setTheme(prevState => {
            const newTheme = !prevState;
            localStorage.setItem("@theme:theme" , JSON.stringify(newTheme))
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme: theme, handleThemeSwitch }}>
            {children}
        </ThemeContext.Provider>
    );
}

function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeSwitchProvider");
    }
    return context;
}

export { ThemeSwitchProvider, useTheme };