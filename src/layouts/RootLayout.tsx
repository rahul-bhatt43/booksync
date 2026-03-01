import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSelector } from "@/components/theme-selector";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Set document title
    document.title = "BookSync - Your AudioBook Platform";

    // Add preconnect links for fonts
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";

    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap";
    fontLink.rel = "stylesheet";

    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(fontLink);
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" defaultColorTheme="orange">
      <div className="font-body antialiased">
        <Outlet />
        <Toaster />
      </div>
      {/* <ThemeSelector /> */}
    </ThemeProvider>
  );
}
