import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    theme: boolean;
    handleThemeSwitch: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeSwitchProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState(true);

    async function handleThemeSwitch () {
        
        setTheme(prevState => {
            const newTheme = !prevState;
            localStorage.setItem("@theme:theme" , JSON.stringify(newTheme))
            return newTheme;
        });
    };

    useEffect(() => {
        const localtheme = localStorage.getItem("@theme:theme");
        if (localtheme) {
            setTheme(JSON.parse(localtheme))
        }
    }, [])

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