import { Moon, Sun, Laptop, Palette, Check } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";
import { cn } from "@/lib/utils";

const themes = [
    { name: "rose", color: "bg-rose-500" },
    { name: "blue", color: "bg-blue-500" },
    { name: "violet", color: "bg-violet-500" },
    { name: "orange", color: "bg-orange-500" },
    { name: "cyan", color: "bg-cyan-500" },
] as const;

export function ThemeSelector() {
    const { theme, setTheme, colorTheme, setColorTheme } = useTheme();

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-lg border-primary/20 hover:border-primary transition-all duration-300 bg-background/80 backdrop-blur-sm"
                    >
                        <Palette className="h-6 w-6" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-4" align="end" sideOffset={10}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-foreground/70">Mode</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTheme("light")}
                                    className={cn(
                                        "h-8 px-2",
                                        theme === "light" && "border-primary bg-primary/10 text-primary"
                                    )}
                                >
                                    <Sun className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Light</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTheme("dark")}
                                    className={cn(
                                        "h-8 px-2",
                                        theme === "dark" && "border-primary bg-primary/10 text-primary"
                                    )}
                                >
                                    <Moon className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Dark</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTheme("system")}
                                    className={cn(
                                        "h-8 px-2",
                                        theme === "system" && "border-primary bg-primary/10 text-primary"
                                    )}
                                >
                                    <Laptop className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Sys</span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-foreground/70">Color</h4>
                            <div className="grid grid-cols-5 gap-2">
                                {themes.map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => setColorTheme(t.name)}
                                        className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            colorTheme === t.name
                                                ? "border-primary"
                                                : "border-transparent",
                                            t.color
                                        )}
                                        title={t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                                    >
                                        {colorTheme === t.name && (
                                            <Check className="h-4 w-4 text-white drop-shadow-md" />
                                        )}
                                        <span className="sr-only">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
